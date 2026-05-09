'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

import {
  derivePanel,
  buildNeighbors,
  graphEdges,
  nodesByLocale,
} from '@/lib/graph-data';
import {
  approachOffset,
  rectCollide,
  roundRect,
  shapeWidth,
  SHAPE_HEIGHT,
  THEME,
  type FGLink,
  type FGNode,
  type Selected,
} from '@/lib/graph-canvas';
import { useLocale } from '@/hooks/useLocale';
import { useContainerSize } from '@/hooks/useContainerSize';
import { useGraphSearch } from '@/hooks/useGraphSearch';

import { GraphHeader } from './GraphHeader';
import { LangSwitcher } from './LangSwitcher';
import { ZoomControls } from './ZoomControls';
import { SidePanel } from '@/components/SidePanel/SidePanel';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
});

type FGRef = {
  d3Force: (name: string, force?: unknown) => unknown;
  zoomToFit: (durationMs?: number, padding?: number) => void;
  centerAt: (x: number, y: number, durationMs?: number) => void;
  zoom: (scale?: number, durationMs?: number) => number;
} | null;

const ZOOM_STEP = 1.4;
const ZOOM_MIN = 0.2;
const ZOOM_MAX = 5;

// Adjacency is locale-agnostic (edges only carry IDs), so we build it once.
const NEIGHBORS = buildNeighbors();

export default function Graph() {
  const fgRef = useRef<FGRef>(null);
  const { ref: containerRef, size } = useContainerSize<HTMLDivElement>();
  const { locale, switchLocale, t } = useLocale();

  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<Selected>(null);

  const graphNodes = useMemo(() => nodesByLocale[locale], [locale]);
  const search = useGraphSearch(graphNodes);

  // Bake labels into FGNode for canvas painting; recompute when locale changes.
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

  // Tune d3-force so connected nodes cluster without overlapping.
  const handleRef = useCallback((instance: FGRef) => {
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
      const tt = typeof l.target === 'object' ? l.target : null;
      const sw = s ? shapeWidth(s) : 100;
      const tw = tt ? shapeWidth(tt) : 100;
      return Math.max(80, (sw + tw) / 2 + 30);
    });
    link?.strength?.(0.55);

    instance.d3Force('collide', rectCollide(4, 2));
  }, []);

  const handleZoomIn = useCallback(() => {
    const fg = fgRef.current;
    if (!fg) return;
    fg.zoom(Math.min(fg.zoom() * ZOOM_STEP, ZOOM_MAX), 220);
  }, []);

  const handleZoomOut = useCallback(() => {
    const fg = fgRef.current;
    if (!fg) return;
    fg.zoom(Math.max(fg.zoom() / ZOOM_STEP, ZOOM_MIN), 220);
  }, []);

  const handleZoomFit = useCallback(() => {
    fgRef.current?.zoomToFit(400, 60);
  }, []);

  const focusNode = useCallback(
    (id: string) => {
      const node = graphData.nodes.find((n) => n.id === id);
      if (node && node.x !== undefined && node.y !== undefined) {
        fgRef.current?.centerAt(node.x, node.y, 600);
      }
      setSelected({ nodeId: id });
      search.setOpen(false);
      search.setQuery('');
      search.inputRef.current?.blur();
    },
    [graphData.nodes, search]
  );

  const focusId = selected?.nodeId ?? hovered;

  const isNodeLit = useCallback(
    (id: string): 'active' | 'dim' | null => {
      if (!focusId) return null;
      if (id === focusId) return 'active';
      if (NEIGHBORS.get(focusId)?.has(id)) return 'active';
      return 'dim';
    },
    [focusId]
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
      let textColor = highlight ? THEME.ACCENT : 'rgba(242, 241, 236, 0.82)';

      switch (node.type) {
        case 'project': {
          roundRect(ctx, x - w / 2, y - h / 2, w, h, 5);
          ctx.fillStyle = highlight
            ? THEME.PROJECT_FILL_HOVER
            : THEME.PROJECT_FILL;
          ctx.fill();
          ctx.lineWidth = highlight ? 1.2 : 0;
          if (highlight) {
            ctx.strokeStyle = THEME.ACCENT;
            ctx.stroke();
          }
          textColor = THEME.BG_DEEP;
          break;
        }
        case 'product': {
          roundRect(ctx, x - w / 2, y - h / 2, w, h, 5);
          ctx.fillStyle = highlight
            ? THEME.PRODUCT_FILL_HOVER
            : THEME.PRODUCT_FILL;
          ctx.fill();
          ctx.lineWidth = highlight ? 1.4 : 1;
          ctx.strokeStyle = highlight ? THEME.BG_DEEP : THEME.PRODUCT_BORDER;
          ctx.stroke();
          textColor = THEME.BG_DEEP;
          break;
        }
        case 'concept': {
          const cut = 7;
          ctx.beginPath();
          ctx.moveTo(x - w / 2 + cut, y - h / 2);
          ctx.lineTo(x + w / 2 - cut, y - h / 2);
          ctx.lineTo(x + w / 2, y);
          ctx.lineTo(x + w / 2 - cut, y + h / 2);
          ctx.lineTo(x - w / 2 + cut, y + h / 2);
          ctx.lineTo(x - w / 2, y);
          ctx.closePath();
          ctx.fillStyle = highlight
            ? THEME.CONCEPT_FILL_HOVER
            : THEME.CONCEPT_FILL;
          ctx.fill();
          ctx.lineWidth = highlight ? 1.4 : 1;
          ctx.strokeStyle = highlight ? THEME.ACCENT : THEME.BORDER_LIGHT;
          ctx.stroke();
          break;
        }
        case 'language': {
          roundRect(ctx, x - w / 2, y - h / 2, w, h, h / 2);
          ctx.fillStyle = highlight
            ? THEME.LANGUAGE_FILL_HOVER
            : THEME.LANGUAGE_FILL;
          ctx.fill();
          ctx.lineWidth = highlight ? 1.2 : 0.8;
          ctx.strokeStyle = highlight ? THEME.BORDER_LIGHT : THEME.BORDER_FAINT;
          ctx.stroke();
          break;
        }
      }

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
      ctx.strokeStyle = THEME.ACCENT;
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

  const panelOpen = selected != null;

  return (
    <div
      data-panel-open={panelOpen || undefined}
      className="
        group dot-grid fixed inset-0 overflow-hidden
        bg-[radial-gradient(ellipse_50%_45%_at_30%_25%,rgb(242_241_236/0.05),transparent_65%),radial-gradient(ellipse_45%_40%_at_75%_75%,rgb(242_241_236/0.04),transparent_60%)]
      "
    >
      <GraphHeader
        inputRef={search.inputRef}
        query={search.query}
        setQuery={search.setQuery}
        open={search.open}
        setOpen={search.setOpen}
        results={search.results}
        activeResult={search.activeResult}
        setActiveResult={search.setActiveResult}
        onPick={focusNode}
        locale={locale}
        t={t}
      />

      <LangSwitcher locale={locale} switchLocale={switchLocale} t={t} />

      <div ref={containerRef} className="absolute inset-0 z-[1] [&_canvas]:cursor-grab [&_canvas:active]:cursor-grabbing">
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
            minZoom={ZOOM_MIN}
            maxZoom={ZOOM_MAX}
          />
        )}
      </div>

      <ZoomControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFit={handleZoomFit}
        t={t}
      />

      <div
        data-active={panelOpen || undefined}
        onClick={() => setSelected(null)}
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-0 z-[25] bg-black/0
          transition-colors duration-[250ms]
          data-[active=true]:bg-black/20 data-[active=true]:pointer-events-auto
        "
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
