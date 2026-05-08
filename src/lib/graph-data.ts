// Locale-scoped lookups for the knowledge graph plus the pure helpers that
// derive the side-panel payload from a selection. Edge topology is locale-
// agnostic (only IDs); the EN file is the canonical source.

import graphEn from '@/data/graph.en.json';
import graphZh from '@/data/graph.zh.json';
import detailsEnRaw from '@/data/details.en.json';
import detailsZhRaw from '@/data/details.zh.json';
import type {
  Domain,
  GraphEdge,
  GraphNode,
  Locale,
  NodeDetail,
  NodeResource,
  NodeType,
} from '@/data/types';
import { STRINGS } from '@/i18n/strings';
import type { Selected } from '@/lib/graph-canvas';

export const graphEdges = graphEn.edges as GraphEdge[];

export const nodesByLocale: Record<Locale, GraphNode[]> = {
  en: graphEn.nodes as GraphNode[],
  zh: graphZh.nodes as GraphNode[],
};

export const detailsByLocale: Record<Locale, Record<string, NodeDetail>> = {
  en: detailsEnRaw as Record<string, NodeDetail>,
  zh: detailsZhRaw as Record<string, NodeDetail>,
};

export const nodesByIdByLocale: Record<Locale, Map<string, GraphNode>> = {
  en: new Map(nodesByLocale.en.map((n) => [n.id, n])),
  zh: new Map(nodesByLocale.zh.map((n) => [n.id, n])),
};

// ── Side-panel data ───────────────────────────────────────────
export interface RelatedNode {
  id: string;
  label: string;
  type: NodeType;
}

export interface PanelData {
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

export function derivePanel(selected: Selected, locale: Locale): PanelData | null {
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

// Adjacency map for hover-highlight (undirected; both upstream & downstream lit).
export function buildNeighbors(): Map<string, Set<string>> {
  const m = new Map<string, Set<string>>();
  graphEdges.forEach((e) => {
    if (!m.has(e.from)) m.set(e.from, new Set());
    if (!m.has(e.to)) m.set(e.to, new Set());
    m.get(e.from)!.add(e.to);
    m.get(e.to)!.add(e.from);
  });
  return m;
}

export function labelForType(type: NodeType, locale: Locale): string {
  return STRINGS[locale].nodeTypeLabel[type];
}

export function faviconUrl(homepage: string): string | null {
  try {
    const host = new URL(homepage).hostname;
    return `https://www.google.com/s2/favicons?sz=64&domain=${host}`;
  } catch {
    return null;
  }
}
