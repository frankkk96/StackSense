export const siteTitle = 'AI 技术栈知识图谱';
export const siteSubtitle = '面向工程师的 AI 学习地图';
export const siteDescription =
  '把 AI 技术栈编织成一张连通的图：经典论文、算法、训练框架、并行硬件、数学基础、编程语言全部作为节点，hover 看连接、点击进详情。';

// ── Main stack: bottom-up dependencies ─────────────────────
// Display order in this array = top → bottom (L5 first, L1 last).
export interface LangChip {
  name: string;
  note?: string; // e.g. '主导', '内核', '+', '汇编'
  slug?: string; // when set, chip is a link
}

export interface Layer {
  slug: string;
  label: string; // 'L5'
  title: string; // '系统软件与协议'
  blurb: string; // short one-line summary
  description: string; // longer paragraph for the detail panel
  topics: string[]; // 3-5 key concepts to surface on the panel
  keys: string[]; // primary tech keywords
  subKeys?: string[]; // secondary keywords
  langs: LangChip[]; // languages most used at this layer
}

export const layers: Layer[] = [
  {
    slug: 'ai-systems',
    label: 'L5',
    title: 'AI 系统',
    blurb:
      '把模型训练好、再把它服务出去：参数和优化器状态切到多卡多机；KV Cache、动态批调度、量化把推理压到极致。',
    description:
      '整个栈最靠近用户的一层。要回答的问题简单粗暴：怎么把模型训练好、再把它服务出去。训练把参数和优化器状态切到多卡多机；推理把 KV Cache、动态批调度、量化做到极致；编译器把动态算子图映射成 GPU 上的实际 kernel。这一层的工程目标，是让"模型 → 服务"这条路又快又便宜。',
    topics: [
      '分布式训练（tensor / pipeline / data parallel + ZeRO）',
      '推理引擎（vLLM · TensorRT-LLM · SGLang）',
      'PagedAttention 与 continuous batching',
      'FlashAttention 与 IO-aware 算子',
      '量化、编译（torch.compile · Triton · XLA）',
    ],
    keys: ['PyTorch', 'vLLM', 'TensorRT', 'DeepSpeed'],
    langs: [
      { name: 'Python', note: '主导', slug: 'python' },
      { name: 'C++', note: '内核', slug: 'cpp' },
    ],
  },
  {
    slug: 'data-engineering',
    label: 'L4a',
    title: '数据工程',
    blurb:
      '存储格式、表格式、计算引擎、流处理、元数据：数据从落盘到查询的整条路径。',
    description:
      '数据从落盘到查询的整条路径都在这里：列式存储格式怎么省空间又快速、表格式怎么在对象存储上做 ACID 和时间旅行、计算引擎怎么把 SQL 编译成分布式执行计划、流处理怎么保证 exactly-once。每一层的取舍都决定了上游能问出什么样的查询，下游能拿到多新鲜的数据。',
    topics: [
      '列式存储（Parquet · ORC）',
      '表格式与湖仓（Iceberg · Delta · Hudi）',
      '计算引擎（Spark · Flink · Trino）',
      '流处理与 exactly-once 语义',
      'OLAP 数据库（ClickHouse · DuckDB）',
    ],
    keys: ['Spark', 'Flink', 'Kafka'],
    subKeys: ['数据库', '数据湖仓'],
    langs: [
      { name: 'Java', slug: 'java' },
      { name: 'Scala', slug: 'scala' },
    ],
  },
  {
    slug: 'distributed-systems',
    label: 'L4b',
    title: '分布式系统',
    blurb:
      '当机器、网络、时钟都不可信时还能保证什么：复制、共识、一致性模型、容错。',
    description:
      '数据系统是分布式系统的应用，分布式系统则是它们能成立的前提。这一层处理一个朴素的问题：当机器、网络、时钟都不可信时，还能保证什么？答案是一组核心抽象——复制、共识、一致性模型、容错、协调——上面所有的数据库、消息队列、调度器都是这些抽象的产物。',
    topics: [
      '共识协议（Paxos · Raft）',
      '一致性模型（linearizable · causal · eventual）',
      '逻辑时钟与因果关系（Lamport · Vector · HLC）',
      '复制与 quorum，CAP / PACELC',
      'Gossip · 失败检测 · 跨节点事务',
    ],
    keys: ['Raft', 'Paxos'],
    subKeys: ['RPC', '容错', '一致性'],
    langs: [
      { name: 'Go', slug: 'go' },
      { name: 'Rust', slug: 'rust' },
    ],
  },
  {
    slug: 'parallel-computing',
    label: 'L3',
    title: '并行计算与硬件加速',
    blurb:
      '从 SM / warp 到 Tensor Core：让上面的 AI 框架真正跑满 GPU 的那一层。',
    description:
      '现代 AI / HPC 工作负载几乎不再跑在 CPU 上。这一层覆盖让代码真正用起加速器的能力：GPU 编程模型、ML 算子库、跨节点通信、HPC 范式。学完这一层，你才知道为什么"同一个模型在不同框架上延迟差几倍"——大多数答案在这里。',
    topics: [
      'CUDA 编程模型（thread / warp / block / grid）',
      '内存层级（registers · shared · L1/L2 · HBM）',
      'Tensor Core 与 MMA 指令',
      '集合通信（NCCL all-reduce ring/tree）',
      '编译与 DSL（Triton · CUTLASS · ROCm）',
    ],
    keys: ['CUDA / ROCm', 'cuDNN', 'NCCL', 'MPI'],
    subKeys: ['GPU 架构', 'Tensor Core', '显存层级'],
    langs: [
      { name: 'CUDA C++', note: '主导', slug: 'cuda-cpp' },
      { name: 'PTX', note: '汇编', slug: 'ptx' },
    ],
  },
  {
    slug: 'os-network',
    label: 'L2',
    title: '操作系统与网络',
    blurb:
      '操作系统抽象 + 计算机网络协议：上面所有 infra 都建在 syscall 和网络栈之上。',
    description:
      '这一层是上面所有 infra 真正落地的地方：操作系统给你进程、内存、文件、IO 这些抽象；网络栈把字节装进包、按地址找到对端、再保证有序送到。绝大多数性能问题、故障定位最后都要下沉到这一层来回答。',
    topics: [
      '系统调用、虚拟内存、调度（CFS · EEVDF）',
      'epoll / io_uring，VFS 与 page cache',
      'TCP / TLS 1.3 / HTTP/2 / QUIC',
      'gRPC · RDMA / RoCE · InfiniBand',
      'eBPF + XDP（可观察性 / 网络 / 安全）',
    ],
    keys: ['操作系统', '进程', '内存', 'IO', '调度'],
    subKeys: ['计算机网络', 'TCP/IP', 'RDMA', 'gRPC'],
    langs: [{ name: 'C', note: '主导', slug: 'c' }],
  },
  {
    slug: 'architecture',
    label: 'L1',
    title: '计算机体系结构',
    blurb:
      'CPU 怎么执行指令、cache 怎么布局、虚拟内存怎么工作：infra 性能问题最后都要回到这一层。',
    description:
      '整个栈最底下、最不容易过时的一层：CPU 流水线和乱序执行、cache 层级和一致性协议、虚拟内存与 TLB、ISA 和 SIMD 的设计取舍。延迟、吞吐、能耗的所有解释最终都要回到这里。',
    topics: [
      'CPU 流水线、乱序执行、超标量',
      '分支预测、推测执行（Spectre / Meltdown）',
      'Cache 层级（L1/L2/L3）与 MESI 协议',
      '虚拟内存、TLB、NUMA、大页',
      'SIMD（AVX-512 / NEON）、ISA 设计取舍',
    ],
    keys: ['CPU 流水线', 'Cache 层级', '虚拟内存'],
    subKeys: ['SIMD', 'ISA', 'NUMA'],
    langs: [
      { name: '汇编', slug: 'assembly' },
      { name: 'Verilog', slug: 'verilog' },
      { name: 'VHDL', slug: 'vhdl' },
    ],
  },
];

// ── Cross-cutting layer: programming languages ─────────────
export interface LangPage {
  slug: string;
  name: string;
  blurb: string;
  placeholder?: boolean;
}

export const languages: LangPage[] = [
  {
    slug: 'python',
    name: 'Python',
    blurb: 'AI / Data 的胶水语言，框架的 API 几乎都是它',
    placeholder: true,
  },
  { slug: 'cpp', name: 'C++', blurb: '基础设施之母语：RAII、模板、UB、性能' },
  { slug: 'rust', name: 'Rust', blurb: '所有权 + 借用：编译期消掉一类 use-after-free' },
  { slug: 'go', name: 'Go', blurb: 'Goroutine + channel：云原生主导语言' },
  {
    slug: 'java',
    name: 'Java',
    blurb: '数据系统、JVM 调优、GC、Off-Heap',
    placeholder: true,
  },
  {
    slug: 'scala',
    name: 'Scala',
    blurb: 'Spark / Flink 的实现语言；FP + 类型系统',
    placeholder: true,
  },
  {
    slug: 'c',
    name: 'C',
    blurb: '操作系统、网络协议栈、xv6 实现的底色',
    placeholder: true,
  },
  {
    slug: 'cuda-cpp',
    name: 'CUDA C++',
    blurb: 'NVIDIA GPU 上的主流 kernel 编写语言',
    placeholder: true,
  },
  {
    slug: 'ptx',
    name: 'PTX',
    blurb: 'NVIDIA GPU 的虚拟汇编 ISA',
    placeholder: true,
  },
  {
    slug: 'assembly',
    name: '汇编',
    blurb: 'x86 / ARM 汇编：性能调优和 ABI 的最后一公里',
    placeholder: true,
  },
  {
    slug: 'verilog',
    name: 'Verilog',
    blurb: '硬件描述语言：FPGA / ASIC 的工程主流',
    placeholder: true,
  },
  {
    slug: 'vhdl',
    name: 'VHDL',
    blurb: '硬件描述语言：航空、欧洲电信、强类型',
    placeholder: true,
  },
];

export const LANG_SLUG: Record<string, string> = Object.fromEntries(
  languages.map((l) => [l.name, l.slug]),
);

export function isLayerSlug(slug: string): boolean {
  return layers.some((l) => l.slug === slug);
}

export function isLanguageSlug(slug: string): boolean {
  return languages.some((l) => l.slug === slug);
}
