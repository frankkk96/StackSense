// Pure canvas helpers for the force-graph: theme tokens, label measurement,
// shape geometry, the rectangle-aware collision force, and a roundRect path
// helper. No React, no DOM access at import time — SSR-safe.

import type { NodeType } from '@/data/types';

// ── Types ─────────────────────────────────────────────────────
export interface FGNode {
  id: string;
  type: NodeType;
  label: string;
  x?: number;
  y?: number;
  fx?: number;
  fy?: number;
}

export interface FGLink {
  source: string | FGNode;
  target: string | FGNode;
}

export type Selected = { nodeId: string } | null;

// ── Theme ─────────────────────────────────────────────────────
export const THEME = {
  ACCENT: 'rgb(242, 241, 236)',
  PROJECT_FILL: 'rgb(232, 231, 224)', // opaque, slightly recessed from ACCENT
  PROJECT_FILL_HOVER: 'rgb(242, 241, 236)',
  CONCEPT_FILL: 'rgb(20, 21, 22)', // opaque deep
  CONCEPT_FILL_HOVER: 'rgb(38, 38, 38)',
  LANGUAGE_FILL: 'rgb(28, 29, 30)', // opaque
  LANGUAGE_FILL_HOVER: 'rgb(40, 41, 42)',
  BG_DEEP: 'rgb(22, 23, 23)',
  BORDER_FAINT: 'rgba(242, 241, 236, 0.22)',
  BORDER_LIGHT: 'rgba(242, 241, 236, 0.65)',
} as const;

// ── Label measurement ─────────────────────────────────────────
const LABEL_FONT_BASE = '13px ui-monospace, "JetBrains Mono", "Fira Code", monospace';
const LABEL_FONT_NORMAL = `500 ${LABEL_FONT_BASE}`;
const LABEL_FONT_BOLD = `600 ${LABEL_FONT_BASE}`;

// Lazy off-screen canvas for accurate text width measurement.
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

export function measureLabelWidth(label: string, type: NodeType): number {
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

// ── Shape geometry ────────────────────────────────────────────
// Padding per type is tuned to leave breathing room around the measured glyph
// box (concept hexagon needs extra for the cut corners).
export function shapeWidth(n: { type: NodeType; label: string }): number {
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

export const SHAPE_HEIGHT = 28;

// Trim length along link direction (treats shape as ellipse).
export function approachOffset(
  n: { type: NodeType; label: string },
  ux: number,
  uy: number
): number {
  const hw = shapeWidth(n) / 2;
  const hh = SHAPE_HEIGHT / 2;
  const denom = Math.hypot(ux / hw, uy / hh);
  return denom === 0 ? hw : 1 / denom;
}

// ── Forces ────────────────────────────────────────────────────
// Built-in `forceCollide` is circular, which pushes wide-label nodes too far
// apart vertically. This resolves overlap on the axis with smaller penetration
// so nodes settle into the tightest non-overlapping packing for their box.
export function rectCollide(padding = 4, iterations = 1) {
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

// ── Path helpers ──────────────────────────────────────────────
export function roundRect(
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
