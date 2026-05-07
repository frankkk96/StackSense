// Per-node side panel content. Each entry is keyed by graph node id.
// Books / courses / papers are NOT in this file — they live in the node's
// `resources` array in graph.ts.

export interface NodeDetail {
  blurb: string;
  concepts: string[];
  questions: string[];
  link?: string;
  logoSlug?: string | null;
}

export const nodeDetails: Record<string, NodeDetail> = {
  // ── 数学基础 ───────────────────────────────────────────
  'linear-algebra': {
    blurb:
      'AI 技术栈最底层的数学：从 attention 的 QK^T 投影、PCA、SVD 到嵌入空间几何，所有现代神经网络的运算都建立在向量空间和矩阵分解之上。',
    concepts: ['向量空间', 'SVD', '特征值', '矩阵乘法', '正交投影'],
    questions: [
      'attention 的 Q·K^T 在线性代数视角下到底在算什么？',
      'SVD 的低秩近似为什么是 LoRA 微调有效的根本原因？',
      'PCA 与 SVD 的等价性怎么推？协方差矩阵特征向量为何指向最大方差方向？',
      '权重矩阵的奇异值分布为什么能预示训练稳定性？',
      '为什么神经网络的 weight matrices 会出现自然的低秩结构？',
    ],
    logoSlug: null,
  },
  calculus: {
    blurb:
      '反向传播本质上就是多变量链式法则；理解 Jacobian、泰勒展开、梯度流，等于理解 autograd 在每个 framework 里的运行方式。',
    concepts: ['链式法则', 'Jacobian', '梯度', '泰勒展开', '偏导数'],
    questions: [
      'Backprop 用 reverse-mode autodiff 而不是 forward-mode，背后的复杂度论据是什么？',
      'Adam 的二阶矩估计在泰勒展开下对应曲率的哪一阶？',
      '为什么 GELU/Swish 这类平滑激活比 ReLU 训得更稳？',
      'softmax 对 logits 的导数为何天然带 "概率减真值" 形式？',
      '扩散模型的连续时间极限（SDE/ODE）背后的微积分直觉是什么？',
    ],
    logoSlug: null,
  },
  probability: {
    blurb:
      '从 cross-entropy 到 dropout、temperature 采样、扩散模型——AI 一切"采样、归一化、不确定性"操作背后都是概率分布、共轭性、MCMC 这些经典工具。',
    concepts: ['MLE/MAP', 'KL 散度', '高斯分布', 'MCMC', '贝叶斯推断'],
    questions: [
      '为什么 cross-entropy 是分类任务的 MLE？跟 KL 散度怎么对应？',
      'VAE 的 ELBO 推导中，KL 项与重构项的权衡如何控制 latent space？',
      'Dropout 为何可以视作贝叶斯近似？',
      'LLM 采样里 temperature/top-p 的统计含义是什么？',
      '扩散模型的 score matching 与变分下界如何统一？',
    ],
    logoSlug: null,
  },
  'convex-optimization': {
    blurb:
      '神经网络非凸，但凸优化的对偶视角、收敛分析、约束建模仍然是 SGD/Adam/RLHF 训练目标设计的理论根。理解凸性是判断"我这个 loss 应该能收敛吗"的最快路径。',
    concepts: ['凸性', 'Lagrange 对偶', 'KKT', '梯度法', 'Lipschitz'],
    questions: [
      '梯度下降在非凸 loss 上为什么仍能找到好解？',
      'AdamW 的 decoupled weight decay 怎么从凸优化收敛分析推出？',
      'RLHF 的 KL 约束为何能写成 Lagrangian 对偶形式？',
      'PPO 借用了凸优化里的 trust-region 思想是怎么对应的？',
      'Lipschitz 平滑/强凸假设对学习率上界意味着什么？',
    ],
    logoSlug: null,
  },
  'information-theory': {
    blurb:
      'Shannon 1948 奠基的信息论：熵、KL 散度、互信息——cross-entropy loss、量化压缩比特率、对比学习的 InfoNCE 全部源自这一套。',
    concepts: ['香农熵', 'KL 散度', '互信息', '率失真', 'cross-entropy'],
    questions: [
      'perplexity 与香农熵的关系是什么？为什么衡量 LM 质量？',
      'KL(p||q) 不对称对 forward-KL vs reverse-KL 训练有何影响？',
      '率失真理论如何指导 LLM 量化（INT4/FP8）的下界？',
      '互信息为何用作自监督对比学习（InfoNCE）的理论解释？',
      'Shannon 源编码定理给 token 压缩 / 字节级 LM 提供了什么下界？',
    ],
    logoSlug: null,
  },

  // ── ML 基础 ───────────────────────────────────────────
  backpropagation: {
    blurb:
      'Rumelhart、Hinton、Williams 1986 年系统化的算法：用链式法则把输出误差从顶层反向传至每个权重。所有现代 autograd 框架的算法基石。',
    concepts: ['链式法则', 'Reverse-mode AD', '计算图', '梯度反传', '隐藏层学习'],
    questions: [
      'Reverse-mode 跟 Forward-mode autodiff 的核心差异？分别适合什么场景？',
      '为什么反向传播在 1986 年才被广泛接受？算力 vs 算法谁是瓶颈？',
      'Backprop 跟数值微分在精度与效率上的取舍？',
      '为什么 Hinton 后来想用 Forward-Forward 替代 Backprop？',
      '在 attention 这种结构里，链式法则的实际计算成本主要花在哪？',
    ],
    logoSlug: null,
  },
  sgd: {
    blurb:
      '梯度下降的随机版：用 mini-batch 估计完整梯度。简单但出奇地能训出现代深度网络——背后是 implicit regularization、噪声逃离平坦极小值的复杂理论。',
    concepts: ['mini-batch', 'Momentum', 'critical batch size', '隐式正则化', '学习率'],
    questions: [
      '为什么 SGD 噪声反而帮助泛化？跟 implicit regularization 怎么关联？',
      'critical batch size 是什么？继续放大 batch 为何边际收益骤降？',
      'Momentum 在数学上等价于哪种 ODE 的离散化？',
      '为什么 LR warmup 对 transformer 训练几乎是必须的？',
      'SGD 能逃离的 saddle point 跟 second-order method 能逃的差别？',
    ],
    logoSlug: null,
  },
  adam: {
    blurb:
      'Kingma & Ba 2014：融合 Momentum 的一阶矩与 RMSProp 的二阶矩估计 + bias correction。是深度学习事实上的默认优化器；AdamW 进一步主导了大模型训练。',
    concepts: ['一阶矩', '二阶矩', 'Bias Correction', 'AdamW', '自适应学习率'],
    questions: [
      'Adam 跟 SGD+Momentum 在泛化上的取舍？',
      'Bias correction 为什么不可省略？',
      'AdamW 的 decoupled weight decay 解决了 Adam 的什么问题？',
      'Adam 跟 RMSProp 的本质差异是什么？',
      '为什么大模型偏爱 AdamW 而非 LAMB/Adafactor？',
    ],
    logoSlug: null,
  },
  'batch-norm': {
    blurb:
      'Ioffe & Szegedy 2015：每层激活做 mini-batch 归一化 + 可学习 γ/β。BN 让深层 CNN 可以用更大学习率训练；但在 Transformer / 小 batch 场景被 LayerNorm 取代。',
    concepts: ['Internal Covariate Shift', 'Mini-batch 统计', 'γβ 仿射', 'Running Mean', 'LayerNorm'],
    questions: [
      'BN 为什么有效？是 covariate shift 还是 loss landscape smoothing？',
      'BN 跟 LayerNorm 在 Transformer 场景的取舍？',
      '为什么 BN 在小 batch 下性能崩溃？',
      'BN 训练态和推理态行为不一致的根源是什么？',
      'GroupNorm / InstanceNorm / RMSNorm 各自适用场景？',
    ],
    logoSlug: null,
  },
  dropout: {
    blurb:
      'Srivastava、Hinton 2014：训练时随机置零神经元，等价于训练指数级子网络的集成。深度学习时代最重要的正则化手段之一；现代大模型对 Dropout 依赖反而下降。',
    concepts: ['随机失活', '模型集成', 'Inverted Dropout', '正则化', 'Co-adaptation'],
    questions: [
      'Dropout 为什么可以解释为模型集成？',
      'Inverted Dropout 跟原版 Dropout 的取舍？',
      '为什么现代大模型对 Dropout 依赖反而下降？',
      'Dropout 跟 BatchNorm 同时使用为什么会冲突？',
      'Dropout 跟 DropConnect、DropPath 的差异？',
    ],
    logoSlug: null,
  },
  word2vec: {
    blurb:
      'Mikolov 2013：CBOW + Skip-gram 浅层模型 + Negative Sampling，把词嵌入推到亿级语料。"king-man+woman≈queen" 揭示了词向量空间的语义线性结构，启发了后来所有的 distributed representation。',
    concepts: ['Skip-gram', 'CBOW', 'Negative Sampling', '分布式表示', '词向量算术'],
    questions: [
      'Skip-gram 跟 CBOW 在低频词上的取舍？',
      'Negative Sampling 跟 Hierarchical Softmax 的本质差异？',
      '为什么向量加减能反映语义关系？',
      'Word2Vec 跟 GloVe 在目标函数上的对比？',
      'Word2Vec 时代的 static embedding vs Transformer 时代 contextual embedding 的根本差距？',
    ],
    logoSlug: null,
  },

  // ── DL 里程碑 ─────────────────────────────────────────
  alexnet: {
    blurb:
      'Krizhevsky et al 2012：8 层 CNN 在 ImageNet 上把 top-5 错误率从 26% 降至 15%；首次在 GPU 上训练大规模深度网络，引入 ReLU、Dropout、数据增强。这一成果直接引爆了深度学习革命。',
    concepts: ['ReLU 激活', 'GPU 训练', '数据增强', 'LRN', 'Conv 层堆叠'],
    questions: [
      '为什么 ReLU 能取代 sigmoid/tanh 解决梯度消失？',
      'AlexNet 的双 GPU 切分跟现代 model parallel 的关系？',
      'Local Response Normalization 为什么后来被 BN 淘汰？',
      'AlexNet 的关键洞察跟算力红利的取舍是什么？',
      '为什么 ImageNet 这个数据集比模型本身更重要？',
    ],
    logoSlug: null,
  },
  resnet: {
    blurb:
      '何恺明 2015：残差连接 H(x)=F(x)+x，让网络学习残差而非直接映射，成功训练 152 乃至 1000 层网络。残差思想后来贯穿 Transformer 等几乎所有现代架构。',
    concepts: ['残差连接', 'Identity Mapping', 'Bottleneck', '深层网络', '梯度流'],
    questions: [
      '残差连接为什么能缓解深层网络退化？',
      'Identity shortcut 跟 projection shortcut 的取舍？',
      '为什么 Pre-Activation ResNet 比原版更好训？',
      'ResNet 的关键洞察跟 Highway Network 的差异是什么？',
      '为什么 Transformer 也必须用残差连接？',
    ],
    logoSlug: null,
  },
  transformer: {
    blurb:
      'Google 2017：用 multi-head self-attention 完全替代 RNN/CNN 处理序列依赖，通过位置编码注入顺序信息。后续 BERT、GPT、几乎所有大模型的基础架构。',
    concepts: ['Self-Attention', 'Multi-Head', '位置编码', 'Encoder-Decoder', 'QKV 投影'],
    questions: [
      '为什么 attention 要除以 sqrt(d_k) 做缩放？',
      'Multi-head 相比单头大 attention 的关键洞察是什么？',
      '为什么用 sin/cos 位置编码而不是可学习 embedding？RoPE / ALiBi 改进了什么？',
      'Self-attention 跟 RNN 在长程依赖上的取舍？',
      '为什么 Transformer 用 LayerNorm 而不是 BatchNorm？',
    ],
    logoSlug: null,
  },
  bert: {
    blurb:
      'Devlin et al 2018：基于 Transformer Encoder 的双向预训练模型，用 Masked LM + NSP 任务在大规模无标注语料上学习深层语言表示。开启了"pretrain + fine-tune"范式，长期主导 NLU 基准。',
    concepts: ['Masked LM', '双向 Encoder', 'NSP', 'pretrain-finetune', 'WordPiece'],
    questions: [
      'BERT 的 MLM 为何要用 80/10/10 的 mask 策略？',
      '为什么 BERT 是 Encoder-only 而 GPT 是 Decoder-only？两者注意力 mask 差异如何决定能力边界？',
      'RoBERTa 通过哪些消融证明 NSP 任务并非必要？',
      'BERT 不能直接用于自回归生成的根源是什么？',
      'BERT 的 [CLS] token 表示在 fine-tune 阶段为何能代表整句语义？',
    ],
    logoSlug: null,
  },
  gpt: {
    blurb:
      'OpenAI GPT 系列：Decoder-only 自回归语言模型。GPT-3 (175B) 证明仅靠扩规模即可通过 in-context learning 完成 few-shot 任务，确立了 prompt 工程与"scale is all you need"的工程范式。',
    concepts: ['in-context learning', 'few-shot', 'Decoder-only', 'autoregressive', 'emergent abilities'],
    questions: [
      'in-context learning 是否真的在"学习"？从梯度视角如何解释？',
      'few-shot 性能曲线相对模型规模在哪些任务出现 emergent abilities？',
      'GPT-3 的稀疏注意力（dense/sparse 交替）解决了什么训练成本问题？',
      'GPT vs BERT 的能力边界差异是什么？',
      '如何在不微调前提下，让 GPT 处理超过 context window 的长文档？',
    ],
    logoSlug: null,
  },
  diffusion: {
    blurb:
      'DDPM (Ho et al 2020) 把扩散与变分推断、score matching 严格连接，用简化的 ε-prediction 目标训练 U-Net。Stable Diffusion / Imagen / Sora 等现代生成模型的理论基石。',
    concepts: ['前向加噪', 'ε-prediction', 'U-Net', 'classifier-free guidance', 'Latent Diffusion'],
    questions: [
      'DDPM 的训练目标 L_simple 与原始 ELBO 的关系？为何去权重后效果更好？',
      '前向过程 q(x_t|x_0) 为什么可以闭式采样？β schedule 的选择为何重要？',
      'DDPM、DDIM、score-based SDE 三种视角如何统一？采样步数为何能从 1000 减到 20？',
      'classifier-free guidance 的数学形式？scale 过大为何导致饱和？',
      'Latent Diffusion 相比 pixel-space DDPM 解决了哪些工程瓶颈？',
    ],
    logoSlug: null,
  },

  // ── LLM 时代 ────────────────────────────────────────
  'scaling-laws': {
    blurb:
      'Kaplan et al 2020：用幂律拟合 LM loss 与参数量 N、数据量 D、计算量 C 的关系，给出 compute-optimal 配比建议。是 GPT-3 决定"先堆参数"的理论依据，但其结论后被 Chinchilla 修正。',
    concepts: ['幂律', 'compute-optimal', 'N/D/C 关系', 'irreducible loss', 'critical batch size'],
    questions: [
      'Kaplan 给出的 N 与 D 最优配比是多少？为何后来被证伪？',
      'irreducible loss 的物理含义是什么？是否对应数据集的熵？',
      '为什么 batch size 也存在临界值？',
      '若把 architecture（深度/宽度比）固定，scaling law 还成立吗？',
      '如何从 scaling law 反推训练目标性能模型所需的 GPU-hours？',
    ],
    logoSlug: null,
  },
  chinchilla: {
    blurb:
      'Hoffmann et al 2022：通过 400+ 训练实验重新拟合 scaling law，提出在固定 compute 下 N 与 D 应等比例放大（约 20 tokens/param），证明 GPT-3 等大模型严重训练不足。70B Chinchilla 在更多 token 上击败 280B Gopher。',
    concepts: ['compute-optimal', '20 tokens/param', 'IsoFLOP', '等比放大', '训练不足'],
    questions: [
      'Chinchilla scaling 反驳了 Kaplan 哪条核心结论？数学差异在哪？',
      'IsoFLOP 曲线如何拟合？为何三种拟合方法结果一致？',
      '若数据规模有上限（data wall），Chinchilla-optimal 是否还成立？',
      'Llama 系列为何故意训练超过 Chinchilla-optimal token 数？',
      '是否考虑了 fine-tuning / RLHF 的 compute？这会改变最优配比吗？',
    ],
    logoSlug: null,
  },
  lora: {
    blurb:
      'Hu et al 2021：冻结预训练权重 W，只训练低秩分解 ΔW = BA（rank r ≪ d），把可训练参数减少几个数量级而几乎无性能损失。当前 PEFT 与扩散模型微调的事实标准。',
    concepts: ['低秩分解', 'PEFT', 'ΔW = BA', 'rank r', 'QLoRA'],
    questions: [
      'LoRA 假设权重更新存在"low intrinsic rank"，实证依据是什么？',
      'LoRA 推理时是否引入额外延迟？合并后还能切换 adapter 吗？',
      'rank r 怎么选？哪些任务 r=1 就够，哪些需要 r=64+？',
      'LoRA / Adapter / Prefix-tuning 在表达能力与显存开销上的本质区别？',
      'QLoRA 的 NF4 为何比 INT4 更优？',
    ],
    logoSlug: null,
  },
  rlhf: {
    blurb:
      'InstructGPT (Ouyang et al 2022) 用「SFT → Reward Model → PPO」三阶段把 GPT-3 对齐到人类偏好。1.3B InstructGPT 在指令遵循上击败 175B GPT-3，确立 RLHF 为 ChatGPT / Claude 等对话模型的标准对齐路线。',
    concepts: ['SFT', 'Reward Model', 'PPO', 'KL 约束', 'DPO'],
    questions: [
      'RLHF 中 KL 惩罚项的作用？没有它会出现什么 reward hacking？',
      '为什么 reward model 用 pairwise ranking loss 而不是直接回归分数？',
      'PPO 在 LM 场景的 actor / critic 各对应什么？value head 与 RM 区别？',
      'DPO 如何用闭式解绕过显式 RM 与 PPO？数据效率孰优孰劣？',
      'alignment tax 指什么？InstructGPT 在哪些 benchmark 出现能力回退？',
    ],
    logoSlug: null,
  },
  moe: {
    blurb:
      'Switch Transformer (Fedus et al 2021)：把 FFN 替换为 N 个专家 + top-1 路由，等量 FLOPs 下把参数量推到万亿级（1.6T）。Mixtral / DeepSeek-MoE / GPT-4 路线的起点。',
    concepts: ['Sparse MoE', 'Top-1 Routing', 'Capacity Factor', '负载均衡 loss', 'Expert Parallel'],
    questions: [
      'Switch 用 top-1 而非 top-2 路由的取舍？',
      'load balancing auxiliary loss 的形式？为何纯 token 计数不可微？',
      'capacity factor 设过小 / 过大分别会发生什么？',
      'expert parallel 与 tensor / pipeline parallel 如何组合？all-to-all 通信开销如何摊销？',
      '为什么 MoE 模型推理时显存占用并不能等比例下降？',
    ],
    logoSlug: null,
  },
  zero: {
    blurb:
      'Microsoft 2019：Zero Redundancy Optimizer 把 optimizer states / gradients / parameters 跨 DP rank 切片，把数据并行的显存占用从 O(N) 降到 O(N/DP)。现代大模型训练显存优化的奠基算法。',
    concepts: ['Optimizer 分片', 'Gradient 分片', 'Parameter 分片', 'Stage 1/2/3', 'FSDP'],
    questions: [
      'ZeRO-3 相比纯 DP 多出多少额外通信？为什么仍然划算？',
      '为什么 optimizer states 是显存大头？Adam 里具体哪几项？',
      'ZeRO 跟 tensor parallel 的本质区别？能否互相替代？',
      'FSDP 对 ZeRO-3 做了什么工程化简化？',
      'ZeRO 在 bf16 + fp32 master weights 下显存账怎么算？',
    ],
    logoSlug: null,
  },

  // ── 分布式系统 ─────────────────────────────────────
  paxos: {
    blurb:
      'Lamport 用通俗语言重写的 Paxos 论文，定义 Prepare/Accept 两阶段达成单值共识。分布式共识的理论原点；Multi-Paxos 把它扩展到 log replication。',
    concepts: ['Prepare/Accept', 'Proposal Number', 'Quorum', 'Single-decree', 'Multi-Paxos'],
    questions: [
      'Paxos 为什么需要两轮而不是一轮？',
      'Multi-Paxos 怎么从 single-decree 扩展到 log replication？',
      'Paxos 跟 Raft 的等价性体现在哪？工程上为什么 Raft 赢了？',
      '活锁问题怎么靠 leader election 缓解？',
      'Fast Paxos / EPaxos 各自降低了什么 latency？',
    ],
    logoSlug: null,
  },
  raft: {
    blurb:
      'Ongaro & Ousterhout 2014：可理解的共识算法。显式拆分 leader election / log replication / safety；工业界共识协议事实标准（etcd / TiKV / CockroachDB）。',
    concepts: ['Leader Election', 'Log Matching', 'Term', 'Commit Index', 'Membership Change'],
    questions: [
      'Raft 的 log matching property 怎么保证 safety？',
      '为什么 Raft 不允许 commit 之前 term 的 log entry？',
      'Joint consensus vs single-server membership change 的取舍？',
      'Pre-vote / CheckQuorum 解决了哪些 partition 下的活性问题？',
      'ReadIndex 优化怎么让 linearizable read 不需要写 log？',
    ],
    logoSlug: null,
  },
  spanner: {
    blurb:
      'Google 2012：用 TrueTime API 把时钟不确定性显式建模，实现外部一致的跨数据中心事务。启发了 CockroachDB / YugabyteDB / TiDB 等一代分布式 SQL 数据库。',
    concepts: ['TrueTime', 'External Consistency', '2PC over Paxos', 'Tablet', 'Commit Wait'],
    questions: [
      'TrueTime 的 commit wait 怎么用物理时钟保证 linearizability？',
      'Spanner 怎么把 2PC 跑在 Paxos group 之上还能保活？',
      '没有原子钟的厂商怎么用 HLC 模拟 TrueTime，代价是什么？',
      'Tablet 跟 Paxos group 的关系决定了哪些扩展性边界？',
      'F1 / Spanner 这套设计在 OLTP / 实时分析的边界？',
    ],
    logoSlug: null,
  },

  // ── 计算机系统 ─────────────────────────────────────
  'computer-architecture': {
    blurb:
      '所有性能问题的最终答案都在这里：流水线、cache 层级、虚拟内存、SIMD、分支预测。理解这一层后，你才能解释为什么同样的代码在不同 CPU 上差几倍。',
    concepts: ['CPU 流水线', 'Cache 层级', 'TLB / 虚拟内存', 'NUMA', 'SIMD'],
    questions: [
      '一条指令从取指、译码、执行到写回，在乱序超标量 CPU 上是怎么并行的？',
      'cache miss 分哪几类？怎么用 perf 量出来？',
      'NUMA 上的"远端访问"比"本地访问"贵多少？数据库为什么要绑核？',
      'TLB miss 跟 cache miss 的代价怎么比较？huge page 何时真正有用？',
      'AVX-512 触发频率降档的代价大概多少？什么时候不该用？',
    ],
    logoSlug: null,
  },
  'operating-systems': {
    blurb:
      '上面所有 infra 都建在 syscall 之上。进程、虚拟内存、调度、文件系统、IO——理解这一层是性能调优、故障定位、容器/虚拟化原理的入口。',
    concepts: ['进程 / 线程', '虚拟内存', '调度（CFS/EEVDF）', 'VFS / page cache', 'epoll / io_uring'],
    questions: [
      '一次系统调用从 user space 到 kernel space 的完整路径？',
      'CFS 到 EEVDF 调度器的设计动机变化？',
      'page cache 跟 direct IO 在数据库场景的取舍？',
      '为什么 io_uring 比 epoll + thread pool 在高 IOPS 下更优？',
      'namespace + cgroup 怎么共同实现容器隔离，各自缺什么？',
    ],
    logoSlug: null,
  },
  'tcp-ip': {
    blurb:
      '从 TCP 三次握手、拥塞控制到 TLS 1.3、HTTP/2、QUIC——分布式系统、推理 RPC、可观测性全部建立在网络栈之上。',
    concepts: ['TCP 状态机', '拥塞控制', 'TLS 1.3', 'HTTP/2 / QUIC', 'eBPF / XDP'],
    questions: [
      'TCP 三次握手 / 四次挥手的状态机有哪些坑（TIME_WAIT、CLOSE_WAIT）？',
      'TCP 拥塞控制（Reno / CUBIC / BBR）的演进动机？',
      'TLS 1.3 的握手相比 1.2 减掉了什么 round trip？0-RTT 的安全代价？',
      'HTTP/2 多路复用解决了什么？HOL blocking 又被 QUIC 怎么再解决？',
      'eBPF + XDP 做包过滤为什么比 iptables 快几个数量级？',
    ],
    logoSlug: null,
  },
  spectre: {
    blurb:
      '2018 年披露的 CPU 推测执行漏洞：利用分支预测与缓存侧信道跨权限边界泄露数据。迫使整个软硬件栈重新审视微架构安全模型。',
    concepts: ['推测执行', '分支预测', 'Cache Side-channel', 'KPTI', 'Retpoline'],
    questions: [
      'Spectre 跟 Meltdown 在攻击向量上的根本区别？',
      '为什么推测执行本质上难以彻底修复？',
      'KPTI / Retpoline 等缓解措施的性能代价从哪来？',
      'cache timing 侧信道如何放大微架构状态泄露？',
      '这类漏洞对未来 CPU 设计（如分离 speculation domain）有什么启示？',
    ],
    logoSlug: null,
  },

  // ── AI / Data 项目 ───────────────────────────────────
  vllm: {
    blurb:
      'UC Berkeley 开源的 LLM 推理引擎：以 PagedAttention 为核心解决 KV Cache 显存碎片，配合 continuous batching 把单卡吞吐推到极限。当前自托管 LLM 服务的事实标准。',
    concepts: ['PagedAttention', 'Continuous Batching', 'Prefix Caching', 'Tensor Parallel', 'Chunked Prefill'],
    questions: [
      'PagedAttention 怎么用 block table 模拟 OS 的虚拟内存分页？',
      'continuous batching 在 prefill / decode 混跑时怎么避免长 prompt 拖死延迟？',
      'prefix caching 的命中粒度和淘汰策略怎么设计？',
      'V1 引擎相比 V0 在调度和异步执行上做了什么重构？',
      '跟 TensorRT-LLM、SGLang 在吞吐 / 易用性上的取舍？',
    ],
    link: 'https://github.com/vllm-project/vllm',
    logoSlug: null,
  },
  'tensorrt-llm': {
    blurb:
      'NVIDIA 官方的 LLM 推理优化库：基于 TensorRT 编译图把 attention、GEMM、量化算子融成 fused kernel，在 H100/B200 上榨干硬件极限。',
    concepts: ['In-flight Batching', 'FP8/FP4 量化', 'Fused Kernel', 'Plugin', 'Speculative Decoding'],
    questions: [
      'TensorRT-LLM 的 engine 编译模型为什么导致部署灵活性差？',
      'in-flight batching 跟 vLLM continuous batching 的实现差异？',
      'FP8 量化在 attention / KV Cache / GEMM 各环节的精度取舍？',
      'Hopper 的 TMA / WGMMA 怎么被利用到 attention kernel？',
      '为什么 NVIDIA 自己又搞 TensorRT-LLM 而不是优化 vLLM？',
    ],
    link: 'https://github.com/NVIDIA/TensorRT-LLM',
    logoSlug: null,
  },
  nanogpt: {
    blurb:
      'Karpathy 写的最小化 GPT 训练实现，~300 行 PyTorch 跑通从 tokenization 到训练 loop 的全流程。读完一遍胜过读十篇综述。',
    concepts: ['Causal Self-attention', 'AdamW', 'Gradient Accumulation', 'DDP', 'Tied Embedding'],
    questions: [
      '为什么 nanoGPT 用 LayerNorm pre-norm 而不是 post-norm？',
      'weight tying 在显存和效果上各带来什么？',
      '学习率 warmup + cosine decay 的工程理由是什么？',
      '从 nanoGPT 扩到千亿参数，哪些组件首先撑不住？',
      'bf16、torch.compile 各自在训练稳定性 / 速度上贡献多少？',
    ],
    link: 'https://github.com/karpathy/nanoGPT',
    logoSlug: null,
  },
  megatron: {
    blurb:
      'NVIDIA 的大模型训练框架，首个把 tensor parallel、pipeline parallel、sequence parallel 三种并行系统化结合的开源实现。Llama / GPT-3 级别的训练栈基本都借鉴自 Megatron。',
    concepts: ['Tensor Parallel', 'Pipeline Parallel', 'Sequence Parallel', 'Selective Recompute', '1F1B Schedule'],
    questions: [
      'TP 切 column-parallel vs row-parallel 在 all-reduce 通信量上的差别？',
      '1F1B pipeline schedule 怎么减小 bubble？跟 interleaved schedule 取舍？',
      'sequence parallel 怎么补 TP 没切到的 LayerNorm / Dropout 显存？',
      '为什么 TP size 通常不超过 8？跟 NVLink 拓扑什么关系？',
      'Megatron + ZeRO 怎么组合？各自负责哪部分并行？',
    ],
    link: 'https://github.com/NVIDIA/Megatron-LM',
    logoSlug: null,
  },
  deepspeed: {
    blurb:
      '微软的分布式训练框架：核心是 ZeRO 系列优化器状态 / 梯度 / 参数分片，加上 offload、3D parallelism、推理优化。让单机多卡也能训百亿参数模型。',
    concepts: ['ZeRO-1/2/3', 'CPU/NVMe Offload', 'ZeRO-Infinity', '3D Parallelism', 'ZeRO++'],
    questions: [
      'ZeRO-3 相比 FSDP 在通信调度和实现复杂度上差在哪？',
      'offload 到 CPU/NVMe 的瓶颈是 PCIe 还是软件栈？',
      'ZeRO++ 的 hierarchical partitioning 怎么解决跨节点通信？',
      'DeepSpeed-Inference 跟 vLLM / TensorRT-LLM 路线分歧？',
      '为什么大厂训练逐渐从 DeepSpeed 迁回 Megatron + FSDP？',
    ],
    link: 'https://github.com/microsoft/DeepSpeed',
    logoSlug: null,
  },
  cutlass: {
    blurb:
      'NVIDIA 开源的 CUDA C++ 模板库，提供高性能 GEMM/卷积的可组合原语。从 warp-level MMA 到 tile scheduler 全栈暴露，是写自定义 kernel 绕过 cuBLAS 黑盒的主流选择。',
    concepts: ['Tile / Warp MMA', 'Epilogue Fusion', 'CuTe', 'Tensor Core', 'Pipelined GEMM'],
    questions: [
      'tile / warp / thread 三层抽象怎么映射到 SM？',
      'CuTe 的 Layout 代数解决了什么传统 CUTLASS 的痛点？',
      'Hopper 上要用 TMA + warp-specialized pipeline 而不是经典 ping-pong 的原因？',
      'epilogue fusion 相比单独写 kernel 的性能差距来自哪？',
      '跟手写 cuBLAS / Triton 的工程取舍？',
    ],
    link: 'https://github.com/NVIDIA/cutlass',
    logoSlug: 'nvidia',
  },
  flashattn: {
    blurb:
      'Tri Dao 团队的 IO-aware attention kernel：通过 tiling + online softmax 把 attention 从 O(N²) 显存读写降到 O(N)。LLM 训练 / 推理事实标准。',
    concepts: ['Online Softmax', 'Tiling', 'IO-aware', 'Recompute Backward', 'TMA / WGMMA'],
    questions: [
      'online softmax 的数值稳定性怎么保证？',
      'v2 把并行维度从 batch/head 改到 seq 解决了什么？',
      'v3 在 Hopper 上如何利用 TMA 和 warp-specialized 流水线？',
      '为什么 backward 选择 recompute 而不是存中间 softmax？',
      '跟 xformers memory-efficient attention 的本质差异？',
    ],
    link: 'https://github.com/Dao-AILab/flash-attention',
    logoSlug: null,
  },
  triton: {
    blurb:
      'OpenAI 推出的 Python DSL + 编译器：以 block-level 张量为一等公民，让算法工程师不写 CUDA 也能产出接近手调的 GPU kernel。PyTorch 2 inductor 的核心后端。',
    concepts: ['Block Programming', 'Auto Schedule', 'MLIR Backend', 'Autotuning', 'Shared Memory'],
    questions: [
      'Triton 的 block 编程模型相比 CUDA thread 模型隐藏了什么、暴露了什么？',
      '编译器怎么自动做 shared memory 分配和 swizzle？',
      '为什么 Triton 在 Hopper 上落后于 CUTLASS，瓶颈在哪？',
      'autotune 的搜索空间怎么剪枝？',
      'torch.compile 用 Triton 做 codegen 的取舍？',
    ],
    link: 'https://github.com/triton-lang/triton',
    logoSlug: null,
  },
  nccl: {
    blurb:
      'NVIDIA 的 GPU 集合通信库：实现 ring/tree/double binary tree 等拓扑感知的 AllReduce / AllGather。直接调度 NVLink、PCIe、IB——分布式训练通信的事实底层。',
    concepts: ['Ring AllReduce', 'Tree AllReduce', 'NVLink / IB', 'Topology Aware', 'GPUDirect RDMA'],
    questions: [
      'ring vs tree allreduce 在不同规模和消息大小下怎么选？',
      'NCCL 如何探测拓扑并自动选 channel 数？',
      '为什么大规模训练要用 SHARP / in-network reduction？',
      '和 MPI、Gloo 的设计哲学根本差异？',
      'GPUDirect RDMA 跳过 CPU 的具体路径？',
    ],
    link: 'https://github.com/NVIDIA/nccl',
    logoSlug: 'nvidia',
  },
  spark: {
    blurb:
      '通用分布式计算引擎：基于 RDD 抽象与 DAG 调度；Catalyst 优化器 + Tungsten 执行引擎使其成为离线批处理与 ETL 的事实标准。',
    concepts: ['RDD', 'Catalyst', 'Tungsten', 'Shuffle', 'AQE'],
    questions: [
      'RDD lineage 跟 checkpoint 的取舍？',
      'Catalyst 优化器有哪几个 phase？逻辑/物理计划怎么转换？',
      'Shuffle 为什么是性能瓶颈？sort-based vs hash-based 怎么选？',
      'AQE 解决了哪些静态优化的痛点？',
      '为什么 Spark 选 JVM 而不像 DuckDB 那样走 native？',
    ],
    link: 'https://github.com/apache/spark',
    logoSlug: 'apachespark',
  },
  flink: {
    blurb:
      '面向流批一体的有状态计算引擎：以 event-time、watermark、exactly-once 状态语义为核心。流式 ETL 与实时数仓的工业标杆。',
    concepts: ['Event Time', 'Watermark', 'Checkpoint', 'State Backend', 'Exactly-once'],
    questions: [
      'Flink 的 Chandy-Lamport checkpoint 怎么实现 exactly-once？',
      'watermark 怎么处理乱序事件？late data 怎么办？',
      'RocksDB state backend 跟 heap state backend 的取舍？',
      'Flink 跟 Spark Structured Streaming 的本质差异？',
      '为什么 Flink 把 batch 当成 streaming 的特例？',
    ],
    link: 'https://github.com/apache/flink',
    logoSlug: 'apacheflink',
  },
  kafka: {
    blurb:
      '分布式持久化日志系统：以 partition + replication 提供高吞吐顺序写。事件驱动架构、流式管道、CDC 的核心总线。',
    concepts: ['Log Abstraction', 'ISR', 'Consumer Group', 'Exactly-once', 'KRaft'],
    questions: [
      '为什么用 append-only log 而不是传统消息队列模型？',
      'ISR 机制怎么平衡可用性与一致性？acks=all 真的安全吗？',
      'KRaft 取代 ZooKeeper 解决了什么架构痛点？',
      'consumer rebalance 为什么慢？cooperative rebalance 怎么改进？',
      'Kafka 跟 Pulsar 在存算分离上的设计差异？',
    ],
    link: 'https://github.com/apache/kafka',
    logoSlug: 'apachekafka',
  },
  iceberg: {
    blurb:
      '开放表格式标准：在对象存储上提供 ACID 事务、schema evolution、time travel 与隐藏分区。湖仓一体的核心 metadata 层。',
    concepts: ['Manifest', 'Snapshot', 'Hidden Partition', 'Schema Evolution', 'Copy-on-Write/MoR'],
    questions: [
      'Iceberg 的 metadata 层级（snapshot / manifest list / manifest）为什么这样设计？',
      'CoW 跟 MoR 在更新场景的取舍？',
      'hidden partitioning 比 Hive 分区好在哪？',
      'Iceberg vs Delta Lake vs Hudi 的核心架构差异？',
      'S3 上怎么做到原子提交？catalog 扮演什么角色？',
    ],
    link: 'https://iceberg.apache.org/',
    logoSlug: 'apacheiceberg',
  },
  duckdb: {
    blurb:
      '进程内嵌入式 OLAP 数据库：向量化执行 + 列存，为单机分析与本地数据科学场景重塑了"分析型 SQLite"的工程范式。',
    concepts: ['向量化执行', '列存', '嵌入式', 'Morsel-driven', 'Pushdown'],
    questions: [
      '向量化执行相比 Volcano model 性能优势从哪来？',
      '为什么 DuckDB 选择嵌入式架构而不是 client-server？',
      'morsel-driven parallelism 怎么实现 NUMA-aware 调度？',
      'Parquet/Arrow 上的零拷贝怎么做到的？',
      '单机 OLAP 跟分布式 OLAP 的边界在哪？',
    ],
    link: 'https://github.com/duckdb/duckdb',
    logoSlug: 'duckdb',
  },
  clickhouse: {
    blurb:
      '面向海量数据的列式 OLAP 数据库：MergeTree 引擎、向量化执行、LSM-like 合并实现亚秒级聚合。实时分析与可观测性场景的工业首选。',
    concepts: ['MergeTree', '向量化执行', '稀疏索引', '物化视图', '分布式表'],
    questions: [
      'MergeTree 的 part 合并机制跟 LSM-tree 异同？',
      '稀疏主键索引为什么够用？跟 B+ 树的取舍？',
      '为什么 ClickHouse 不擅长高并发 point query？',
      'ReplicatedMergeTree 怎么做副本同步？ZooKeeper 是瓶颈吗？',
      'ClickHouse 跟 Druid / Pinot 在实时摄入上的设计差异？',
    ],
    link: 'https://github.com/ClickHouse/ClickHouse',
    logoSlug: 'clickhouse',
  },
  etcd: {
    blurb:
      '基于 Raft 的分布式 KV 存储：Kubernetes 控制面的事实标准；提供线性一致读、watch 和 lease。',
    concepts: ['Raft', 'MVCC', 'Watch', 'Lease', 'Linearizable Read'],
    questions: [
      'etcd 的 linearizable read 怎么用 ReadIndex 优化掉 log 写入？',
      'watch 在 compaction 之后怎么保证 client 不丢事件？',
      '为什么 etcd 用 boltdb/bbolt 而不是 LSM？',
      'K8s 把 etcd 打爆的常见模式有哪些，怎么缓解？',
    ],
    link: 'https://etcd.io/',
    logoSlug: 'etcd',
  },
  tikv: {
    blurb:
      '分布式事务 KV 存储，TiDB 的存储层：基于 Raft 多副本 + Region 分片 + Percolator 模型实现跨 Region 的分布式事务。',
    concepts: ['Multi-Raft', 'Region 分裂', 'Percolator', 'RocksDB', 'TSO'],
    questions: [
      'Multi-Raft 的 Region 分裂 / 合并怎么不破坏一致性？',
      'Percolator 2PC 跟 Spanner TrueTime 的路线取舍？',
      'PD 的 TSO 单点会不会成为瓶颈？怎么扩展？',
      '热点 Region 的负载均衡是怎么做的？',
    ],
    link: 'https://tikv.org/',
    logoSlug: 'tikv',
  },
  cockroach: {
    blurb:
      'Spanner 启发的开源分布式 SQL 数据库：Range 分片 + Raft 复制 + HLC 时钟实现 serializable 跨区事务。',
    concepts: ['Range 分片', 'Raft', 'HLC', 'Serializable', 'Follower Read'],
    questions: [
      '没有 TrueTime 怎么用 HLC + uncertainty interval 模拟外部一致性？',
      'Range split / rebalance 跟 lease transfer 的协调？',
      'Serializable 隔离下的 read refresh 机制怎么避免 abort 风暴？',
      '对比 Spanner / TiDB，CRDB 的工程取舍？',
    ],
    link: 'https://www.cockroachlabs.com/docs/',
    logoSlug: 'cockroachlabs',
  },
  zookeeper: {
    blurb:
      '经典分布式协调服务：基于 ZAB 协议提供顺序一致性的小文件命名空间。Hadoop / Kafka / HBase 时代的 coordination 基础设施。',
    concepts: ['ZAB', 'Znode', 'Watch', 'Session', 'Sequential Consistency'],
    questions: [
      'ZAB 跟 Paxos / Raft 的本质差别？',
      '为什么 ZK 是顺序一致而不是线性一致？',
      'watch 的 one-shot 设计踩过哪些坑？',
      'session expiration 跟 ephemeral node 怎么协同避免脑裂？',
    ],
    link: 'https://zookeeper.apache.org/',
    logoSlug: 'apachezookeeper',
  },
  linux: {
    blurb:
      '现代基础设施的事实操作系统内核：覆盖进程调度、虚拟内存、VFS、网络协议栈、cgroup/namespace。容器、KVM、eBPF、io_uring 全部建立在其上。',
    concepts: ['CFS / EEVDF', 'VFS', 'Network Stack', 'cgroup / namespace', 'eBPF'],
    questions: [
      'CFS 到 EEVDF 调度器的设计动机变化？',
      'page cache 跟 direct IO 在数据库场景的取舍？',
      '为什么 io_uring 比 epoll + thread pool 在高 IOPS 下更优？',
      'namespace + cgroup 怎么共同实现容器隔离？',
      'eBPF 为什么能在内核里安全运行用户字节码？',
    ],
    link: 'https://github.com/torvalds/linux',
    logoSlug: 'linux',
  },
  nginx: {
    blurb:
      '高性能 HTTP / 反向代理服务器：master-worker + 事件驱动 + 非阻塞 IO，单机十万级并发的工业基准。',
    concepts: ['事件驱动', 'Master-Worker', '反向代理', '零拷贝', 'Phase Handler'],
    questions: [
      '为什么选 master-worker 多进程而不是多线程？',
      'phase handler 设计怎么平衡扩展性和性能？',
      '和 Envoy 在数据面架构上的根本差异？',
      'worker 之间的负载均衡（accept_mutex / SO_REUSEPORT）怎么演进？',
      'tcp/http upstream keepalive 池的实现要点？',
    ],
    link: 'https://github.com/nginx/nginx',
    logoSlug: 'nginx',
  },
  cilium: {
    blurb:
      '基于 eBPF 的云原生网络 / 安全 / 可观测性数据面：直接在内核 hook 点实现 service mesh、network policy、L7 路由，绕开 iptables / kube-proxy 的性能瓶颈。',
    concepts: ['eBPF Datapath', 'XDP', 'Identity-based Policy', 'Service Mesh', 'Hubble'],
    questions: [
      '为什么 eBPF 能替代 iptables / kube-proxy？性能差距来自哪？',
      'Cilium 的 identity-based policy 相比 IP-based 的优势？',
      'XDP 和 tc hook 的取舍，各自落在哪一层？',
      'sidecarless service mesh 相比 Istio sidecar 的工程取舍？',
      'Hubble 怎么在数据面零侵入做 L7 可观测？',
    ],
    link: 'https://github.com/cilium/cilium',
    logoSlug: 'cilium',
  },

  // ── 编程语言 ──────────────────────────────────────────
  python: {
    blurb:
      'AI / Data 栈的默认控制层：训练脚本、DAG、推理服务的外壳都是它。CPython 的 GIL 与引用计数决定了热路径必须下沉到 C/C++ kernel，Python 只做 orchestration。',
    concepts: ['GIL', 'asyncio', 'CPython 字节码', 'pybind11 / Cython', 'duck typing'],
    questions: [
      'GIL 在 CPU-bound 和 IO-bound 下的吞吐差距大概几个数量级？',
      'PyTorch / NumPy 为什么在 C++ 层就把 GIL release 掉？',
      'asyncio 的事件循环跟 OS 线程调度是什么关系？',
      'PEP 703 free-threaded CPython 对引用计数做了哪些改造？',
      'type hints 在 runtime 是否强制？',
    ],
    link: 'https://docs.python.org/3/',
    logoSlug: 'python',
  },
  cpp: {
    blurb:
      '基础设施之母语：RAII、模板、UB、性能。C++ 是几乎所有数据库、推理运行时、游戏引擎的实现语言；理解它的内存模型和 ABI 是工业 infra 的入门券。',
    concepts: ['RAII', '智能指针', '移动语义', 'Memory Model', 'Templates'],
    questions: [
      'RAII 比 try/finally 或 defer 更彻底是为什么？',
      '为什么 Google / LLVM 禁用异常？工程取舍是什么？',
      'memory_order_relaxed / acquire / release / seq_cst 区别？什么时候可以放心用 relaxed？',
      'C++20 coroutine 底层是什么？跟 stackful coroutine 取舍？',
      'pimpl 解决了 ABI 稳定的哪些问题？代价是什么？',
    ],
    link: 'https://en.cppreference.com/w/cpp',
    logoSlug: 'cplusplus',
  },
  rust: {
    blurb:
      '所有权 + 借用：把 use-after-free 这一类 bug 在编译期消掉。Rust 正在数据库、浏览器、操作系统等领域接替 C++ 的位置。',
    concepts: ['Ownership', 'Lifetimes', 'Send / Sync', 'async/await', 'Unsafe'],
    questions: [
      'Ownership + borrow checker 禁掉了 C++ 哪些操作？',
      'Send / Sync trait 分别说明什么？为什么 Rc<T> 不是 Sync 而 Arc<T> 是？',
      'Rust async 是 zero-cost 但又需要 executor，Pin 又解决了什么？',
      'Unsafe Rust 开了哪些特权？什么时候不得不用？',
      'declarative macro 跟 procedural macro 各自适合什么场景？',
    ],
    link: 'https://doc.rust-lang.org/book/',
    logoSlug: 'rust',
  },
  go: {
    blurb:
      'Goroutine + channel：云原生主导语言。K8s、Docker、etcd、Prometheus、CockroachDB 都是 Go 写的。卖点不是语言本身的创新，而是把 goroutine + 单一工具链 + 强约定组合得让中等团队稳定产出。',
    concepts: ['Goroutine / GMP', 'Channel', 'GC', 'Context', 'Memory Model'],
    questions: [
      'Goroutine 比 OS 线程轻到什么程度？基于信号的异步抢占解决了什么？',
      'channel 的底层 hchan 是什么？buffered vs unbuffered 唤醒语义？',
      'concurrent mark-and-sweep 的 write barrier 解决了什么？当前 STW 典型耗时多少？',
      'context.Context 的正确用法？cancel 信号怎么穿透到 syscall？',
      'sync.Pool 解决了什么？在 GC 时的行为？',
    ],
    link: 'https://go.dev/doc/',
    logoSlug: 'go',
  },
  java: {
    blurb:
      '数据基础设施的工业母语：Kafka、Flink、Spark、HDFS、Cassandra、Elasticsearch 几乎全是 JVM 系。GC、JIT 与 off-heap 内存管理是写大数据系统时绕不开的真实问题。',
    concepts: ['JVM / JIT', 'GC (G1 / ZGC)', 'off-heap', 'NIO / Netty', 'Project Loom'],
    questions: [
      'G1 和 ZGC 在 stop-the-world 时间上差几个数量级？',
      '为什么 Flink / Spark 都要绕开 JVM heap 走 off-heap？',
      'JIT 的 C1 / C2 / 分层编译触发条件？',
      'Java 的 NIO 跟 Linux epoll 怎么对应？Netty 加了什么？',
      'Project Loom 的虚拟线程对 reactive 编程冲击有多大？',
    ],
    link: 'https://docs.oracle.com/en/java/',
    logoSlug: 'openjdk',
  },
  scala: {
    blurb:
      'Spark / Flink 核心代码的母语：跑在 JVM 上但带 ML 风格的类型系统，implicit / case class / 函数式 collection 让 DSL 与分布式算子比 Java 紧凑得多。',
    concepts: ['implicit / given', 'case class', 'Akka actor', 'Future / Effect', 'Type class'],
    questions: [
      'implicit resolution 为什么经常拖慢编译？',
      '为什么 Spark 的 DataFrame DSL 选择 Scala 而不是 Java？',
      'Scala 2 与 Scala 3 在隐式 / 元编程上的设计差异？',
      'Akka actor model 跟 Erlang OTP 的取舍？',
      'Type class 模式在 Scala 怎么实现？对比 Haskell 有何阉割？',
    ],
    link: 'https://docs.scala-lang.org/',
    logoSlug: 'scala',
  },
  c: {
    blurb:
      '操作系统、数据库存储引擎、网络协议栈的事实标准：手动内存管理 + 几乎为零的运行时。理解 C 等于理解 Linux 的源码。',
    concepts: ['指针 / 别名', 'undefined behavior', 'ABI', 'memory model', '宏 / 预处理'],
    questions: [
      'strict aliasing 在做高性能 SIMD 时怎么绕开？',
      'C11 memory model 的 acquire / release 跟 x86 / ARM 硬件保证怎么对应？',
      '为什么 Linux kernel 至今坚持 C 而不是 C++？',
      'signed integer overflow 是 UB 这件事对编译器优化意味着什么？',
      'restrict 关键字到底能给优化器带来多少收益？',
    ],
    link: 'https://en.cppreference.com/w/c',
    logoSlug: 'c',
  },
  'cuda-cpp': {
    blurb:
      'GPU kernel 的主战场：在 C++ 上扩展 __global__ / __device__ 与 thread/block/grid 抽象。开发者要同时管 register、shared memory、warp 行为，性能调优本质上是写访存模式。',
    concepts: ['warp / SIMT', 'shared memory', 'memory coalescing', 'stream / event', 'occupancy'],
    questions: [
      'warp divergence 为什么会让一个 if-else 性能掉一半？',
      'shared memory bank conflict 怎么发生？怎么排布数据避免？',
      'tensor core 的 WMMA / MMA API 跟普通 CUDA core 的编程模型差在哪？',
      '为什么提高 occupancy 不一定提高吞吐？',
      'CUDA Graph 相比传统 stream 的 launch overhead 优化在哪？',
    ],
    link: 'https://docs.nvidia.com/cuda/cuda-c-programming-guide/',
    logoSlug: 'nvidia',
  },
  ptx: {
    blurb:
      'NVIDIA GPU 的虚拟 ISA：位于 CUDA C++ 与真正 SASS 之间的中间层，提供跨架构的指令抽象。手写 fused kernel、调 cp.async / mma 指令、看反汇编时绕不开的一层。',
    concepts: ['虚拟 ISA', 'SASS 对应', 'cp.async', 'mma 指令', 'predicate 寄存器'],
    questions: [
      'PTX 与 SASS 的关系？为什么 NVIDIA 不直接暴露 SASS？',
      'cp.async 跟普通 ld.global 在 latency hiding 上的差异？',
      '为什么 FlashAttention / cutlass 要直接写 PTX inline asm？',
      'mma.sync 指令的 fragment 布局跟 tensor core 硬件如何对应？',
      'ptxas 的优化等级 -O3 vs -O0 实际能差出多少？',
    ],
    link: 'https://docs.nvidia.com/cuda/parallel-thread-execution/',
    logoSlug: 'nvidia',
  },
  assembly: {
    blurb:
      'x86 / ARM / RISC-V 机器指令层：在性能关键路径（memcpy、加密、SIMD kernel、JIT 出口）和调试 core dump、看 perf annotate 时必须读懂的最终形态。',
    concepts: ['calling convention', 'SIMD (AVX / NEON)', '寄存器分配', 'memory ordering', 'ABI'],
    questions: [
      'x86 strong memory model 跟 ARM weak model 在写无锁结构时差在哪？',
      'AVX-512 频率降档的代价大概多少？什么时候不该用？',
      '看 perf annotate 时怎么把热点指令对回 C 源码？',
      'RISC-V vector extension 跟 x86 SIMD 的设计哲学差异？',
      '为什么 syscall 要走特定寄存器约定？',
    ],
    link: 'https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html',
    logoSlug: null,
  },
};
