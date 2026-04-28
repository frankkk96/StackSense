export const siteTitle = 'AI / Data Infra 知识地图';
export const siteSubtitle = '一份面向系统工程师的学习地图';
export const siteDescription =
  '面向系统工程师的 AI / Data Infra 知识地图：把基础语言、操作系统、数据 / AI 栈、工程实践和延伸阅读放到一张图上，按主题跳读。';

export const moduleDescriptions: Record<string, string> = {
  language: '把三种系统语言的心智模型放在一起对照看',
  os: '通过 xv6 把进程、内存、I/O 抽象拆开看一遍',
  network: '看懂一次 HTTPS 背后从内核到应用的全链路',
  distributed: '当机器、网络、时钟都不可信时还能保证什么',
  'data-infra': '存储、列存、流处理、湖仓：现代数据栈的取舍',
  'ai-infra': '模型怎么真正跑在硬件上：并行、推理、编译',
  cuda: '从 SM / warp 到 FlashAttention：写 GPU kernel',
  engineering: '容器、K8s、SLO、tracing：让代码在生产稳定跑',
  projects: '分布式 / Data / AI / CUDA 四方向的代表作源码',
  books: '经得起十年检验的桌面书目',
  courses: '带 lab 的公开课，比啃十本书都管用',
};

export const moduleTags: Record<string, string> = {
  language: 'LANG',
  os: 'OS',
  network: 'NET',
  distributed: 'DIST',
  'data-infra': 'DATA',
  'ai-infra': 'AI',
  cuda: 'GPU',
  engineering: 'OPS',
  projects: 'CODE',
  books: 'READ',
  courses: 'LAB',
};

export interface Track {
  id: string;
  label: string;
  sub: string;
  hint: string;
  slugs: string[];
}

export const tracks: Track[] = [
  {
    id: 'foundations',
    label: '系统基础',
    sub: 'Foundations',
    hint: '所有 infra 都坐落在它们之上的四层抽象',
    slugs: ['language', 'os', 'network', 'distributed'],
  },
  {
    id: 'data-ai',
    label: '数据与 AI',
    sub: 'Data & AI Infra',
    hint: '从数据栈到模型、从存储引擎到 GPU kernel',
    slugs: ['data-infra', 'ai-infra', 'cuda'],
  },
  {
    id: 'engineering',
    label: '工程实践',
    sub: 'Engineering',
    hint: '让代码真正在生产里跑稳的那一层',
    slugs: ['engineering'],
  },
  {
    id: 'reference',
    label: '延伸阅读',
    sub: 'Reference',
    hint: '源码、经典书、公开课',
    slugs: ['projects', 'books', 'courses'],
  },
];

export function trackOf(slug: string): Track | undefined {
  return tracks.find((t) => t.slugs.includes(slug));
}
