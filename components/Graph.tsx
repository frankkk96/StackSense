'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { forceCollide } from 'd3-force';
import {
  graphNodes,
  graphEdges,
  type NodeType,
  type EdgeKind,
  type NodeResource,
} from '../src/data/graph';
import { nodeDetails } from '../src/data/details';
import Logo from './Logo';
import {
  ArrowUpRight,
  Box,
  Braces,
  Lightbulb,
  X as IconX,
} from 'lucide-react';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
});

// ── Types ─────────────────────────────────────────────────────
interface FGNode {
  id: string;
  type: NodeType;
  label: string;
  x?: number;
  y?: number;
  fx?: number;
  fy?: number;
}

interface FGLink {
  source: string | FGNode;
  target: string | FGNode;
  kind: EdgeKind;
}

type Selected = { nodeId: string } | null;

// ── Theme constants ───────────────────────────────────────────
const ACCENT = 'rgb(242, 241, 236)';
const PROJECT_FILL = 'rgb(232, 231, 224)'; // opaque, slightly recessed from ACCENT
const PROJECT_FILL_HOVER = 'rgb(242, 241, 236)';
const CONCEPT_FILL = 'rgb(20, 21, 22)'; // opaque deep
const CONCEPT_FILL_HOVER = 'rgb(38, 38, 38)';
const LANGUAGE_FILL = 'rgb(28, 29, 30)'; // opaque
const LANGUAGE_FILL_HOVER = 'rgb(40, 41, 42)';
const BG_DEEP = 'rgb(22, 23, 23)';
const BORDER_FAINT = 'rgba(242, 241, 236, 0.22)';
const BORDER_LIGHT = 'rgba(242, 241, 236, 0.65)';

// ── Helpers ───────────────────────────────────────────────────
function approxLabelWidth(label: string): number {
  let w = 0;
  for (const ch of label) {
    if (/[一-龥]/.test(ch)) w += 19;
    else w += 10;
  }
  return w;
}

// Shape dimensions — every node now contains its label inside the shape.
function shapeWidth(n: { type: NodeType; label: string }): number {
  const tw = approxLabelWidth(n.label);
  switch (n.type) {
    case 'project':
      return Math.max(60, tw + 20);
    case 'concept':
      return Math.max(70, tw + 32); // hexagon needs extra for the cut corners
    case 'language':
      return Math.max(68, tw + 22);
  }
}

const SHAPE_HEIGHT = 28;

// Trim length along link direction (treats shape as ellipse).
function approachOffset(
  n: { type: NodeType; label: string },
  ux: number,
  uy: number
): number {
  const hw = shapeWidth(n) / 2;
  const hh = SHAPE_HEIGHT / 2;
  const denom = Math.hypot(ux / hw, uy / hh);
  return denom === 0 ? hw : 1 / denom;
}

// Per-node collision radius — keeps labeled boxes from overlapping in the sim.
function collideRadius(n: { type: NodeType; label: string }): number {
  return shapeWidth(n) / 2 + 6;
}

// ── Component ─────────────────────────────────────────────────
export default function Graph() {
  const fgRef = useRef<{
    d3Force: (name: string, force?: unknown) => unknown;
    zoomToFit: (durationMs?: number, padding?: number) => void;
    centerAt: (x: number, y: number, durationMs?: number) => void;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<Selected>(null);

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        setSize({
          w: containerRef.current.clientWidth,
          h: containerRef.current.clientHeight,
        });
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Build adjacency for hover-highlight (undirected; both upstream & downstream lit).
  const neighbors = useMemo(() => {
    const m = new Map<string, Set<string>>();
    graphEdges.forEach((e) => {
      if (!m.has(e.from)) m.set(e.from, new Set());
      if (!m.has(e.to)) m.set(e.to, new Set());
      m.get(e.from)!.add(e.to);
      m.get(e.to)!.add(e.from);
    });
    return m;
  }, []);

  // No pinning — let the force simulation lay nodes out organically (Obsidian-style).
  const graphData = useMemo(
    () => ({
      nodes: graphNodes.map(
        (n) =>
          ({
            id: n.id,
            type: n.type,
            label: n.label,
          }) as FGNode
      ),
      links: graphEdges.map((e) => ({
        source: e.from,
        target: e.to,
        kind: e.kind,
      })) as FGLink[],
    }),
    []
  );

  // Tune the d3-force simulation so connected nodes settle into clusters
  // without overlapping, and unrelated nodes drift apart.
  const handleRef = useCallback((instance: typeof fgRef.current) => {
    fgRef.current = instance;
    if (!instance) return;

    const charge = instance.d3Force('charge') as {
      strength?: (s: number) => unknown;
      distanceMax?: (d: number) => unknown;
    } | null;
    charge?.strength?.(-380);
    charge?.distanceMax?.(900);

    const link = instance.d3Force('link') as {
      distance?: (fn: number | ((l: FGLink) => number)) => unknown;
      strength?: (s: number) => unknown;
    } | null;
    link?.distance?.((l: FGLink) => {
      const s = typeof l.source === 'object' ? l.source : null;
      const t = typeof l.target === 'object' ? l.target : null;
      const sw = s ? shapeWidth(s) : 100;
      const tw = t ? shapeWidth(t) : 100;
      return Math.max(80, (sw + tw) / 2 + 30);
    });
    link?.strength?.(0.55);

    instance.d3Force(
      'collide',
      forceCollide<FGNode>()
        .radius((n) => collideRadius(n))
        .strength(0.9)
        .iterations(2)
    );
  }, []);

  const focusId = selected?.nodeId ?? hovered;

  const isNodeLit = useCallback(
    (id: string): 'active' | 'dim' | null => {
      if (!focusId) return null;
      if (id === focusId) return 'active';
      if (neighbors.get(focusId)?.has(id)) return 'active';
      return 'dim';
    },
    [focusId, neighbors]
  );

  const isLinkLit = useCallback(
    (fromId: string, toId: string): 'active' | 'dim' | null => {
      if (!focusId) return null;
      if (fromId === focusId || toId === focusId) return 'active';
      return 'dim';
    },
    [focusId]
  );

  // ── Canvas painting ─────────────────────────────────────────
  const paintNode = useCallback(
    (node: FGNode, ctx: CanvasRenderingContext2D) => {
      if (node.x === undefined || node.y === undefined) return;
      const { x, y } = node;
      const lit = isNodeLit(node.id);
      const isSelected = selected?.nodeId === node.id;
      const highlight = lit === 'active' || isSelected;

      ctx.save();
      ctx.globalAlpha = lit === 'dim' ? 0.28 : 1;

      const w = shapeWidth(node);
      const h = SHAPE_HEIGHT;
      let textColor = highlight ? ACCENT : 'rgba(242, 241, 236, 0.82)';

      switch (node.type) {
        case 'project': {
          // Filled chip — opaque cream fill, dark text.
          roundRect(ctx, x - w / 2, y - h / 2, w, h, 5);
          ctx.fillStyle = highlight ? PROJECT_FILL_HOVER : PROJECT_FILL;
          ctx.fill();
          ctx.lineWidth = highlight ? 1.2 : 0;
          if (highlight) {
            ctx.strokeStyle = ACCENT;
            ctx.stroke();
          }
          textColor = BG_DEEP;
          break;
        }
        case 'concept': {
          // Hexagon with cut corners — opaque deep fill, light text.
          const cut = 7;
          ctx.beginPath();
          ctx.moveTo(x - w / 2 + cut, y - h / 2);
          ctx.lineTo(x + w / 2 - cut, y - h / 2);
          ctx.lineTo(x + w / 2, y);
          ctx.lineTo(x + w / 2 - cut, y + h / 2);
          ctx.lineTo(x - w / 2 + cut, y + h / 2);
          ctx.lineTo(x - w / 2, y);
          ctx.closePath();
          ctx.fillStyle = highlight ? CONCEPT_FILL_HOVER : CONCEPT_FILL;
          ctx.fill();
          ctx.lineWidth = highlight ? 1.4 : 1;
          ctx.strokeStyle = highlight ? ACCENT : BORDER_LIGHT;
          ctx.stroke();
          break;
        }
        case 'language': {
          // Pill — opaque dark fill, monospace.
          roundRect(ctx, x - w / 2, y - h / 2, w, h, h / 2);
          ctx.fillStyle = highlight ? LANGUAGE_FILL_HOVER : LANGUAGE_FILL;
          ctx.fill();
          ctx.lineWidth = highlight ? 1.2 : 0.8;
          ctx.strokeStyle = highlight ? BORDER_LIGHT : BORDER_FAINT;
          ctx.stroke();
          break;
        }
      }

      // Label centered inside the shape.
      const fontSize = 13;
      const weight = node.type === 'language' ? '600 ' : '500 ';
      ctx.font = `${weight}${fontSize}px ui-monospace, "JetBrains Mono", "Fira Code", monospace`;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillStyle = textColor;
      ctx.fillText(node.label, x, y + 1);

      ctx.restore();
    },
    [isNodeLit, selected]
  );

  const paintPointerArea = useCallback(
    (node: FGNode, color: string, ctx: CanvasRenderingContext2D) => {
      if (node.x === undefined || node.y === undefined) return;
      const w = shapeWidth(node) + 4;
      const h = SHAPE_HEIGHT + 8;
      ctx.fillStyle = color;
      ctx.fillRect(node.x - w / 2, node.y - h / 2, w, h);
    },
    []
  );

  const paintLink = useCallback(
    (link: FGLink, ctx: CanvasRenderingContext2D) => {
      const start = link.source;
      const end = link.target;
      if (typeof start !== 'object' || typeof end !== 'object') return;
      if (
        start.x === undefined ||
        start.y === undefined ||
        end.x === undefined ||
        end.y === undefined
      )
        return;

      const lit = isLinkLit(start.id, end.id);

      let alpha = 0.16;
      let lineWidth = 0.8;
      if (lit === 'active') {
        alpha = 0.82;
        lineWidth = 1.4;
      } else if (lit === 'dim') {
        alpha = 0.04;
      }

      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const len = Math.hypot(dx, dy) || 1;
      const ux = dx / len;
      const uy = dy / len;
      const startOffset = approachOffset(start, ux, uy) + 1;
      const endOffset = approachOffset(end, ux, uy) + 1;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = ACCENT;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(start.x + ux * startOffset, start.y + uy * startOffset);
      ctx.lineTo(end.x - ux * endOffset, end.y - uy * endOffset);
      ctx.stroke();
      ctx.restore();
    },
    [isLinkLit]
  );

  // Once the simulation cools the first time, frame the cluster nicely.
  // Subsequent stops (after drag) shouldn't yank the camera back.
  const fittedRef = useRef(false);
  const handleEngineStop = useCallback(() => {
    if (fittedRef.current) return;
    fgRef.current?.zoomToFit(600, 60);
    fittedRef.current = true;
  }, []);

  // First-mount safety: if the sim is still warm when the canvas mounts,
  // try to fit a moment later so the user doesn't see an off-center blob.
  useEffect(() => {
    if (size.w === 0 || size.h === 0 || fittedRef.current) return;
    const t = setTimeout(() => {
      if (!fittedRef.current) fgRef.current?.zoomToFit(600, 60);
    }, 1500);
    return () => clearTimeout(t);
  }, [size.w, size.h]);

  const panel = derivePanel(selected);

  return (
    <div className={`full-graph ${selected ? 'has-panel' : ''}`}>
      <header className="graph-header">
        <a className="brand" href="/">
          <Logo size={22} className="brand-logo" />
          <span className="brand-name">StackSense</span>
        </a>
      </header>

      <div ref={containerRef} className="graph-canvas-wrap">
        {size.w > 0 && size.h > 0 && (
          <ForceGraph2D
            ref={handleRef as never}
            graphData={graphData}
            width={size.w}
            height={size.h}
            backgroundColor="rgba(0,0,0,0)"
            nodeCanvasObject={paintNode as never}
            nodePointerAreaPaint={paintPointerArea as never}
            linkCanvasObject={paintLink as never}
            linkCanvasObjectMode={() => 'replace'}
            onNodeHover={(node: unknown) =>
              setHovered((node as FGNode | null)?.id ?? null)
            }
            onNodeClick={(node: unknown) =>
              setSelected({ nodeId: (node as FGNode).id })
            }
            onBackgroundClick={() => setSelected(null)}
            onEngineStop={handleEngineStop}
            warmupTicks={120}
            cooldownTicks={400}
            enableZoomInteraction
            enablePanInteraction
            enableNodeDrag
            onNodeDragEnd={(node: unknown) => {
              const n = node as FGNode;
              n.fx = n.x;
              n.fy = n.y;
            }}
            minZoom={0.2}
            maxZoom={5}
          />
        )}
      </div>

      <div
        className={`panel-backdrop${selected ? ' is-active' : ''}`}
        onClick={() => setSelected(null)}
        aria-hidden="true"
      />

      <SidePanel panel={panel} onClose={() => setSelected(null)} />
    </div>
  );
}

// ── Helpers (geometry) ────────────────────────────────────────
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.arcTo(x + w, y, x + w, y + radius, radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.arcTo(x + w, y + h, x + w - radius, y + h, radius);
  ctx.lineTo(x + radius, y + h);
  ctx.arcTo(x, y + h, x, y + h - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
}

// ── Side panel ──────────────────────────────────────────────
interface PanelData {
  iconType: NodeType;
  logoSlug?: string | null;
  title: string;
  intro?: string;
  questions: string[];
  concepts: string[];
  resources?: NodeResource[];
}

function derivePanel(selected: Selected): PanelData | null {
  if (!selected) return null;
  const node = graphNodes.find((n) => n.id === selected.nodeId);
  if (!node) return null;
  const detail = nodeDetails[node.id];
  return {
    iconType: node.type,
    logoSlug: detail?.logoSlug ?? null,
    title: node.label,
    intro: detail?.blurb,
    questions: detail?.questions ?? [],
    concepts: detail?.concepts ?? [],
    resources: node.resources,
  };
}

function SidePanel({
  panel,
  onClose,
}: {
  panel: PanelData | null;
  onClose: () => void;
}) {
  return (
    <aside className={`side-panel${panel ? ' is-open' : ''}`} aria-hidden={!panel}>
      <div className="side-panel-inner">
        <button
          type="button"
          className="side-panel-close"
          onClick={onClose}
          aria-label="关闭"
          title="关闭"
        >
          <IconX size={15} strokeWidth={1.6} />
        </button>

        {panel && (
          <>
            <header className="side-panel-head">
              <PanelIcon type={panel.iconType} logoSlug={panel.logoSlug} />
              <div>
                <h2 className="side-panel-title">{panel.title}</h2>
                <span className="side-panel-type">
                  {labelForType(panel.iconType)}
                </span>
              </div>
            </header>

            {panel.intro && <p className="side-panel-intro">{panel.intro}</p>}

            {panel.resources && panel.resources.length > 0 && (
              <section className="side-panel-section">
                <h3>资源</h3>
                <ul className="side-panel-resource-list">
                  {panel.resources.map((r) => (
                    <li key={r.href}>
                      <a
                        href={r.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="resource-kind">{r.kind}</span>
                        <span className="resource-label">{r.label}</span>
                        <ArrowUpRight size={12} strokeWidth={1.7} />
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {panel.concepts.length > 0 && (
              <section className="side-panel-section">
                <h3>核心概念</h3>
                <ul className="side-panel-concepts">
                  {panel.concepts.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </section>
            )}

            {panel.questions.length > 0 && (
              <section className="side-panel-section">
                <h3>学完后你应该能回答</h3>
                <ol className="side-panel-questions">
                  {panel.questions.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ol>
              </section>
            )}
          </>
        )}
      </div>
    </aside>
  );
}

const TYPE_ICON: Record<NodeType, typeof Box> = {
  project: Box,
  concept: Lightbulb,
  language: Braces,
};

function PanelIcon({
  type,
  logoSlug,
}: {
  type: NodeType;
  logoSlug?: string | null;
}) {
  const [logoFailed, setLogoFailed] = useState(false);

  if (logoSlug && !logoFailed) {
    return (
      <img
        src={`https://cdn.simpleicons.org/${logoSlug}/F2F1EC`}
        width={28}
        height={28}
        className="panel-icon panel-icon-brand"
        alt=""
        aria-hidden="true"
        onError={() => setLogoFailed(true)}
      />
    );
  }

  const Icon = TYPE_ICON[type];
  return (
    <span className={`panel-icon panel-icon-${type}`} aria-hidden="true">
      <Icon size={26} strokeWidth={1.5} />
    </span>
  );
}

function labelForType(type: NodeType): string {
  switch (type) {
    case 'project':
      return '开源项目';
    case 'concept':
      return '概念 / 知识';
    case 'language':
      return '编程语言';
  }
}
