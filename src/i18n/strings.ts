// All static UI strings keyed by locale. Data strings (node labels, blurbs,
// concepts, questions, tags) live in graph.<locale>.json + details.<locale>.json
// — this file is only for chrome that surrounds the data.

import type { Locale, NodeType } from '../data/types';

export interface UIStrings {
  searchPlaceholder: string;
  searchAria: string;

  zoomIn: string;
  zoomOut: string;
  zoomFit: string;
  close: string;

  sectionResources: (n: number) => string;
  sectionConcepts: string;
  sectionQuestions: string;
  sectionRelated: (n: number) => string;
  jumpTo: (label: string) => string;

  nodeTypeLabel: Record<NodeType, string>;

  langSwitcherLabel: string;
}

const en: UIStrings = {
  searchPlaceholder: 'Search nodes…',
  searchAria: 'Search nodes',

  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
  zoomFit: 'Fit to screen',
  close: 'Close',

  sectionResources: (n) => `Resources · ${n}`,
  sectionConcepts: 'Core concepts',
  sectionQuestions: 'Questions you should be able to answer',
  sectionRelated: (n) => `Related nodes · ${n}`,
  jumpTo: (label) => `Jump to ${label}`,

  nodeTypeLabel: {
    project: 'Open-source project',
    concept: 'Concept',
    language: 'Language',
    product: 'Product',
  },

  langSwitcherLabel: 'Switch language',
};

const zh: UIStrings = {
  searchPlaceholder: '搜索节点…',
  searchAria: '搜索节点',

  zoomIn: '放大',
  zoomOut: '缩小',
  zoomFit: '适应窗口',
  close: '关闭',

  sectionResources: (n) => `资源 · ${n}`,
  sectionConcepts: '核心概念',
  sectionQuestions: '学完后你应该能回答',
  sectionRelated: (n) => `相关节点 · ${n}`,
  jumpTo: (label) => `跳转到 ${label}`,

  nodeTypeLabel: {
    project: '开源项目',
    concept: '概念 / 知识',
    language: '编程语言',
    product: '产品',
  },

  langSwitcherLabel: '切换语言',
};

export const STRINGS: Record<Locale, UIStrings> = { en, zh };
