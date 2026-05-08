import type { Locale } from './types';

type LocalizedString = Record<Locale, string>;

export const siteTitle: LocalizedString = {
  en: 'AI Stack Knowledge Graph',
  zh: 'AI 技术栈知识图谱',
};

export const siteDescription: LocalizedString = {
  en: 'AI / Data / Systems engineering as a connected graph: classic papers, algorithms, training frameworks, parallel hardware, foundational math, and programming languages — every node is clickable, every edge is a real dependency.',
  zh: '把 AI 技术栈编织成一张连通的图：经典论文、算法、训练框架、并行硬件、数学基础、编程语言全部作为节点，hover 看连接、点击进详情。',
};
