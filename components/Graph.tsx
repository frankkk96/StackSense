'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import graphEn from '../src/data/graph.en.json';
import graphZh from '../src/data/graph.zh.json';
import detailsEnRaw from '../src/data/details.en.json';
import detailsZhRaw from '../src/data/details.zh.json';
import type {
  Domain,
  GraphEdge,
  GraphNode,
  Locale,
  NodeDetail,
  NodeResource,
  NodeType,
} from '../src/data/types';
import { DEFAULT_LOCALE, LOCALES } from '../src/data/types';
import { contactEmail } from '../src/data/site';
import { STRINGS } from '../src/i18n/strings';
import {
  ArrowUpRight,
  Box,
  Braces,
  Lightbulb,
  Maximize2,
  Minus,
  Plus,
  Search,
  X as IconX,
} from 'lucide-react';

// Edges only carry IDs (`from`/`to`), so they're locale-agnostic — the EN file
// is the canonical source for topology.
const graphEdges = graphEn.edges as GraphEdge[];

const nodesByLocale: Record<Locale, GraphNode[]> = {
  en: graphEn.nodes as GraphNode[],
  zh: graphZh.nodes as GraphNode[],
};

const detailsByLocale: Record<Locale, Record<string, NodeDetail>> = {
  en: detailsEnRaw as Record<string, NodeDetail>,
  zh: detailsZhRaw as Record<string, NodeDetail>,
};

const nodesByIdByLocale: Record<Locale, Map<string, GraphNode>> = {
  en: new Map(nodesByLocale.en.map((n) => [n.id, n])),
  zh: new Map(nodesByLocale.zh.map((n) => [n.id, n])),
};

const LOCALE_STORAGE_KEY = 'stacksense.locale';

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
const LABEL_FONT_BASE = '13px ui-monospace, "JetBrains Mono", "Fira Code", monospace';
const LABEL_FONT_NORMAL = `500 ${LABEL_FONT_BASE}`;
const LABEL_FONT_BOLD = `600 ${LABEL_FONT_BASE}`;

// Lazy off-screen canvas for accurate text width measurement. SSR-safe.
let measureCtx: CanvasRenderingContext2D | null | undefined;
function getMeasureCtx(): CanvasRenderingContext2D | null {
  if (measureCtx !== undefined) return measureCtx;
  if (typeof document === 'undefined') {
    measureCtx = null;
    return null;
  }
  measureCtx = document.createElement('canvas').getContext('2d');
  return measureCtx;
}

const widthCache = new Map<string, number>();

function measureLabelWidth(label: string, type: NodeType): number {
  const font = type === 'language' ? LABEL_FONT_BOLD : LABEL_FONT_NORMAL;
  const key = `${type}|${label}`;
  const cached = widthCache.get(key);
  if (cached !== undefined) return cached;
  const ctx = getMeasureCtx();
  let w: number;
  if (ctx) {
    ctx.font = font;
    w = Math.ceil(ctx.measureText(label).width);
  } else {
    // SSR fallback — best-effort approximation per char.
    w = 0;
    for (const ch of label) w += /[一-鿿]/.test(ch) ? 14 : 8;
  }
  widthCache.set(key, w);
  return w;
}

// Shape dimensions — every node now contains its label inside the shape.
// Padding per type is tuned to leave breathing room around the measured glyph
// box (concept hexagon needs extra for the cut corners).
function shapeWidth(n: { type: NodeType; label: string }): number {
  const tw = measureLabelWidth(n.label, n.type);
  switch (n.type) {
    case 'project':
      return Math.max(60, tw + 22);
    case 'concept':
      return Math.max(70, tw + 32);
    case 'language':
      return Math.max(60, tw + 22);
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

// Custom rectangle-aware collision force. Built-in `forceCollide` is circular,
// which pushes wide-label nodes too far apart vertically. Here we resolve
// overlap on the axis with the smaller penetration, so the nodes settle into
// the tightest non-overlapping packing for their actual painted box.
function rectCollide(padding = 4, iterations = 1) {
  let nodes: FGNode[] = [];
  function force() {
    const n = nodes.length;
    for (let iter = 0; iter < iterations; iter++) {
      for (let i = 0; i < n; i++) {
        const a = nodes[i];
        if (a.x === undefined || a.y === undefined) continue;
        const aw = shapeWidth(a) / 2 + padding;
        const ah = SHAPE_HEIGHT / 2 + padding;
        for (let j = i + 1; j < n; j++) {
          const b = nodes[j];
          if (b.x === undefined || b.y === undefined) continue;
          const bw = shapeWidth(b) / 2 + padding;
          const bh = SHAPE_HEIGHT / 2 + padding;
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const overlapX = aw + bw - Math.abs(dx);
          const overlapY = ah + bh - Math.abs(dy);
          if (overlapX <= 0 || overlapY <= 0) continue;
          if (overlapX < overlapY) {
            const push = (overlapX / 2) * (dx < 0 ? -1 : 1);
            a.x -= push;
            b.x += push;
          } else {
            const push = (overlapY / 2) * (dy < 0 ? -1 : 1);
            a.y -= push;
            b.y += push;
          }
        }
      }
    }
  }
  force.initialize = (input: FGNode[]) => {
    nodes = input;
  };
  return force;
}

// ── Component ─────────────────────────────────────────────────
export default function Graph() {
  const fgRef = useRef<{
    d3Force: (name: string, force?: unknown) => unknown;
    zoomToFit: (durationMs?: number, padding?: number) => void;
    centerAt: (x: number, y: number, durationMs?: number) => void;
    zoom: (scale?: number, durationMs?: number) => number;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<Selected>(null);

  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeResult, setActiveResult] = useState(0);

  // ── Locale ─────────────────────────────────────────────────
  // Default to the build-time default; client-side hydration reads the saved
  // preference from localStorage. We keep SSR output stable by NOT reading
  // localStorage during initial render.
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (saved && (LOCALES as string[]).includes(saved)) {
      setLocale(saved as Locale);
    }
  }, []);

  const switchLocale = useCallback((next: Locale) => {
    setLocale(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
      document.documentElement.setAttribute(
        'lang',
        next === 'zh' ? 'zh-CN' : 'en'
      );
    }
  }, []);

  const t = STRINGS[locale];
  // Derive locale-scoped data with stable identity per locale so downstream
  // useMemo / useCallback deps don't re-fire on every render.
  const graphNodes = useMemo(() => nodesByLocale[locale], [locale]);
  const nodeDetails = useMemo(() => detailsByLocale[locale], [locale]);

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

  // Search: case-insensitive substring match against label / id / domain / tags, capped.
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [] as GraphNode[];
    return graphNodes
      .filter((n) => {
        if (n.label.toLowerCase().includes(q)) return true;
        if (n.id.toLowerCase().includes(q)) return true;
        if (n.domain.toLowerCase().includes(q)) return true;
        for (const tag of n.tags) if (tag.toLowerCase().includes(q)) return true;
        return false;
      })
      .slice(0, 12);
  }, [searchQuery, graphNodes]);

  useEffect(() => {
    setActiveResult(0);
  }, [searchQuery]);

  // ⌘K / Ctrl+K focuses the search input. Esc clears + blurs.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // No pinning — let the force simulation lay nodes out organically (Obsidian-style).
  // Re-derives when locale changes: labels are baked into FGNode for canvas painting.
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
      })) as FGLink[],
    }),
    [graphNodes]
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

    instance.d3Force('collide', rectCollide(4, 2));
  }, []);

  const ZOOM_STEP = 1.4;
  const ZOOM_MIN = 0.2;
  const ZOOM_MAX = 5;

  const handleZoomIn = useCallback(() => {
    const fg = fgRef.current;
    if (!fg) return;
    const cur = fg.zoom();
    fg.zoom(Math.min(cur * ZOOM_STEP, ZOOM_MAX), 220);
  }, []);

  const handleZoomOut = useCallback(() => {
    const fg = fgRef.current;
    if (!fg) return;
    const cur = fg.zoom();
    fg.zoom(Math.max(cur / ZOOM_STEP, ZOOM_MIN), 220);
  }, []);

  const handleZoomFit = useCallback(() => {
    fgRef.current?.zoomToFit(400, 60);
  }, []);

  const focusNode = useCallback(
    (id: string) => {
      const fg = graphData.nodes.find((n) => n.id === id);
      if (fg && fg.x !== undefined && fg.y !== undefined) {
        fgRef.current?.centerAt(fg.x, fg.y, 600);
      }
      setSelected({ nodeId: id });
      setSearchOpen(false);
      setSearchQuery('');
      searchInputRef.current?.blur();
    },
    [graphData.nodes]
  );

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

  const panel = useMemo(() => derivePanel(selected, locale), [selected, locale]);

  return (
    <div className={`full-graph ${selected ? 'has-panel' : ''}`}>
      <header className="graph-header">
        <a className="brand" href="/">
          <img
            src="/logo.svg"
            alt=""
            width={22}
            height={Math.round((22 * 413) / 724)}
            className="brand-logo"
          />
          <span className="brand-name">StackSense</span>
        </a>

        <div
          className={`graph-search${searchOpen && searchResults.length > 0 ? ' has-results' : ''}`}
        >
          <Search
            size={14}
            strokeWidth={1.8}
            className="graph-search-icon"
            aria-hidden="true"
          />
          <input
            ref={searchInputRef}
            type="text"
            className="graph-search-input"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => {
              // Delay so onMouseDown on results can still fire.
              window.setTimeout(() => setSearchOpen(false), 120);
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveResult((i) =>
                  Math.min(i + 1, Math.max(0, searchResults.length - 1))
                );
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveResult((i) => Math.max(0, i - 1));
              } else if (e.key === 'Enter') {
                e.preventDefault();
                const hit = searchResults[activeResult];
                if (hit) focusNode(hit.id);
              } else if (e.key === 'Escape') {
                if (searchQuery) setSearchQuery('');
                else searchInputRef.current?.blur();
              }
            }}
            aria-label={t.searchAria}
          />
          <kbd className="graph-search-hint" aria-hidden="true">
            ⌘K
          </kbd>
          {searchOpen && searchResults.length > 0 && (
            <ul className="graph-search-results" role="listbox">
              {searchResults.map((n, i) => (
                <li
                  key={n.id}
                  role="option"
                  aria-selected={i === activeResult}
                  className={`graph-search-result${i === activeResult ? ' is-active' : ''}`}
                  onMouseEnter={() => setActiveResult(i)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    focusNode(n.id);
                  }}
                >
                  <span className="graph-search-result-label">{n.label}</span>
                  <span className="graph-search-result-type">
                    {labelForType(n.type, locale)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>

      <div className="top-right-cluster">
        <a
          className="contact-link"
          href={`mailto:${contactEmail}`}
          title={contactEmail}
        >
          {contactEmail}
        </a>
        <button
          type="button"
          className="graph-lang-btn"
          onClick={() => switchLocale(locale === 'en' ? 'zh' : 'en')}
          aria-label={t.langSwitcherLabel}
          title={t.langSwitcherLabel}
        >
          {t.langGlyph}
        </button>
      </div>

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

      <div className="graph-zoom-controls" role="group" aria-label={t.zoomIn}>
        <button
          type="button"
          className="graph-zoom-btn"
          onClick={handleZoomIn}
          aria-label={t.zoomIn}
          title={t.zoomIn}
        >
          <Plus size={15} strokeWidth={1.8} />
        </button>
        <button
          type="button"
          className="graph-zoom-btn"
          onClick={handleZoomOut}
          aria-label={t.zoomOut}
          title={t.zoomOut}
        >
          <Minus size={15} strokeWidth={1.8} />
        </button>
        <button
          type="button"
          className="graph-zoom-btn"
          onClick={handleZoomFit}
          aria-label={t.zoomFit}
          title={t.zoomFit}
        >
          <Maximize2 size={13} strokeWidth={1.8} />
        </button>
      </div>

      <div
        className={`panel-backdrop${selected ? ' is-active' : ''}`}
        onClick={() => setSelected(null)}
        aria-hidden="true"
      />

      <SidePanel
        panel={panel}
        onClose={() => setSelected(null)}
        onSelectNode={focusNode}
        locale={locale}
      />
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
interface RelatedNode {
  id: string;
  label: string;
  type: NodeType;
}

interface PanelData {
  iconType: NodeType;
  homepage?: string;
  title: string;
  intro?: string;
  questions: string[];
  concepts: string[];
  resources?: NodeResource[];
  domain: Domain;
  tags: string[];
  related: RelatedNode[];
}

// Edges are treated as undirected here — a connection is just a connection,
// regardless of which side is `from`/`to` in the JSON. Same node connected
// via multiple edges only appears once.
function buildRelated(nodeId: string, locale: Locale): RelatedNode[] {
  const byId = nodesByIdByLocale[locale];
  const seen = new Set<string>();
  const out: RelatedNode[] = [];
  for (const e of graphEdges) {
    let otherId: string | null = null;
    if (e.from === nodeId) otherId = e.to;
    else if (e.to === nodeId) otherId = e.from;
    else continue;
    if (seen.has(otherId)) continue;
    seen.add(otherId);
    const other = byId.get(otherId);
    if (!other) continue;
    out.push({ id: other.id, label: other.label, type: other.type });
  }
  out.sort((a, b) => a.label.localeCompare(b.label));
  return out;
}

function derivePanel(selected: Selected, locale: Locale): PanelData | null {
  if (!selected) return null;
  const node = nodesByIdByLocale[locale].get(selected.nodeId);
  if (!node) return null;
  const detail = detailsByLocale[locale][node.id];
  return {
    iconType: node.type,
    homepage: node.homepage,
    title: node.label,
    intro: detail?.blurb,
    questions: detail?.questions ?? [],
    concepts: detail?.concepts ?? [],
    resources: node.resources,
    domain: node.domain,
    tags: node.tags,
    related: buildRelated(node.id, locale),
  };
}

function SidePanel({
  panel,
  onClose,
  onSelectNode,
  locale,
}: {
  panel: PanelData | null;
  onClose: () => void;
  onSelectNode: (id: string) => void;
  locale: Locale;
}) {
  const t = STRINGS[locale];
  return (
    <aside className={`side-panel${panel ? ' is-open' : ''}`} aria-hidden={!panel}>
      <div className="side-panel-inner">
        <button
          type="button"
          className="side-panel-close"
          onClick={onClose}
          aria-label={t.close}
          title={t.close}
        >
          <IconX size={15} strokeWidth={1.6} />
        </button>

        {panel && (
          <>
            <header className="side-panel-head">
              <PanelIcon type={panel.iconType} homepage={panel.homepage} />
              <div>
                <h2 className="side-panel-title">{panel.title}</h2>
                <span className="side-panel-type">
                  {labelForType(panel.iconType, locale)}
                </span>
              </div>
            </header>

            {(panel.tags.length > 0 || panel.domain) && (
              <div className="side-panel-tags">
                <span className="side-panel-tag is-domain">{panel.domain}</span>
                {panel.tags.map((t) => (
                  <span key={t} className="side-panel-tag">
                    {t}
                  </span>
                ))}
              </div>
            )}

            {panel.intro && <p className="side-panel-intro">{panel.intro}</p>}

            {panel.resources && panel.resources.length > 0 && (
              <section className="side-panel-section">
                <h3>{t.sectionResources(panel.resources.length)}</h3>
                <div className="side-panel-chip-list">
                  {panel.resources.map((r) => (
                    <a
                      key={r.href}
                      href={r.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="side-panel-chip side-panel-chip-resource"
                      title={r.label}
                    >
                      <span className="chip-kind">{r.kind}</span>
                      <span className="chip-label">{r.label}</span>
                      <ArrowUpRight size={11} strokeWidth={1.7} />
                    </a>
                  ))}
                </div>
              </section>
            )}

            {panel.concepts.length > 0 && (
              <section className="side-panel-section">
                <h3>{t.sectionConcepts}</h3>
                <ul className="side-panel-concepts">
                  {panel.concepts.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </section>
            )}

            {panel.related.length > 0 && (
              <section className="side-panel-section">
                <h3>{t.sectionRelated(panel.related.length)}</h3>
                <div className="side-panel-chip-list">
                  {panel.related.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      className={`side-panel-chip side-panel-chip-related type-${r.type}`}
                      onClick={() => onSelectNode(r.id)}
                      title={t.jumpTo(r.label)}
                    >
                      <span className="chip-label">{r.label}</span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {panel.questions.length > 0 && (
              <section className="side-panel-section">
                <h3>{t.sectionQuestions}</h3>
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

function faviconUrl(homepage: string): string | null {
  try {
    const host = new URL(homepage).hostname;
    return `https://www.google.com/s2/favicons?sz=64&domain=${host}`;
  } catch {
    return null;
  }
}

function PanelIcon({
  type,
  homepage,
}: {
  type: NodeType;
  homepage?: string;
}) {
  const [logoFailed, setLogoFailed] = useState(false);
  const src = homepage ? faviconUrl(homepage) : null;

  // Reset failure state when homepage changes (e.g., user navigated to another node).
  useEffect(() => {
    setLogoFailed(false);
  }, [homepage]);

  if (src && !logoFailed) {
    return (
      <img
        src={src}
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

function labelForType(type: NodeType, locale: Locale): string {
  return STRINGS[locale].nodeTypeLabel[type];
}
