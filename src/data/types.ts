// Shared types for the knowledge graph. Pure data lives in graph.json /
// details.json; this file only defines the shape they conform to.

export type NodeType = 'concept' | 'project' | 'language';

export type EdgeKind = 'implements' | 'uses' | 'depends' | 'covers';

export type ResourceKind =
  | 'paper'
  | 'project'
  | 'docs'
  | 'site'
  | 'video'
  | 'book'
  | 'course';

export interface NodeResource {
  kind: ResourceKind;
  label: string;
  href: string;
}

export interface GraphNode {
  id: string;
  type: NodeType;
  label: string;
  href: string;
  external?: boolean;
  resources?: NodeResource[];
}

export interface GraphEdge {
  from: string;
  to: string;
  kind: EdgeKind;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface NodeDetail {
  blurb: string;
  concepts: string[];
  questions: string[];
  link?: string;
  logoSlug?: string | null;
}
