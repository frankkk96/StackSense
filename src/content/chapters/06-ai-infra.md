---
title: "AI Infra"
order: 6
slug: "ai-infra"
---

AI 基础设施关心的是模型怎么真正跑在硬件上：训练怎么把参数、梯度、优化器状态切到多卡多机，推理怎么在 GPU 上把 KV Cache 和调度做得尽量高效，编译器怎么把算子图映射到 CUDA / Tensor Core。掌握这层，才能解释为什么同一个模型跑在不同框架上延迟差几倍，以及成本优化从哪里下手。

## 学完后你应该能回答

###  GPU 基础 & CUDA 

  1. CUDA 的 thread / warp / block / grid 是怎么映射到 SM 上的？为什么 block size 一般选 128 或 256 的倍数？
  2. 什么是 memory coalescing？一次 warp 访存不 coalesce 会导致几倍的带宽浪费？
  3. HBM / L2 / SMEM / register 各自的带宽和延迟差多少？常见"算子慢"究竟卡在哪一级？
  4. Roofline 模型里算子是 compute-bound 还是 memory-bound，对 kernel 的优化方向意味着什么？

###  训练并行 

  1. Data / Tensor / Pipeline 三种并行各自切的是什么？训练 70B 模型时为什么必须组合使用而不能只用 DP？
  2. ZeRO 1/2/3 分别把什么切开了？它和 FSDP 的关系是什么？通信量相比普通 DP 增加了多少？
  3. Pipeline parallel 的 bubble 怎么来？1F1B、interleaved 1F1B、zero-bubble 分别怎么压缩 bubble？
  4. Sequence parallel / context parallel 解决了什么 TP 覆盖不到的问题？
  5. overlap compute 和 comm 是怎么做的？NCCL 的 stream 和 buffer 配合起来，哪个算子最常挡在关键路径上？
  6. Gradient checkpointing 用什么换什么？激活重算节省的显存和额外 compute 的比例大概是多少？

###  推理优化 

  1. KV Cache 占显存的公式是什么？为什么长 context 推理时它比参数本身还大？
  2. PagedAttention 解决的是 KV Cache 的什么问题？为什么说它把显存利用率从 20-40% 提升到 90%+？
  3. Continuous batching 和传统 static batching 的区别？为什么它对 LLM 推理吞吐的提升特别大？
  4. FlashAttention 快在哪里？它本质是算法优化还是访存优化？为什么说它不改变 attention 的数学结果？
  5. Prefill 和 decode 阶段的计算模式差别在哪？PD 分离部署能带来多大吞吐提升？
  6. Speculative decoding 的 Medusa / EAGLE / Lookahead 各自怎么生成 draft？加速比受什么限制？
  7. Prefix cache 在多轮对话和 system prompt 共享时能省多少 KV？和 SGLang 的 radix tree 有什么关系？

###  精度 & 量化 

  1. 混合精度训练（fp16 / bf16 / fp8）的数值范围差异？为什么 fp16 需要 loss scaling 而 bf16 通常不用？
  2. INT8 / INT4 / AWQ / GPTQ 几种量化方案的区别？哪些场景精度损失会变得不可接受？
  3. fp8 训练（Hopper E4M3 / E5M2）相比 bf16 省了多少？收敛风险在哪？
  4. KV cache 量化到 INT8 / INT4 对长 context 推理延迟的影响？哪些模型架构更容易掉点？

###  模型架构 (MoE / GQA) 

  1. LoRA / QLoRA 相比全参微调，显存和质量如何权衡？哪些层放 LoRA 性价比最高？
  2. MoE 的 expert parallel 实现里最难的三个问题是什么（routing、all-to-all、load imbalance）？
  3. GQA / MQA 相对 MHA 省了什么？为什么几乎所有新模型都选 GQA？
  4. DeepSeek MoE 的 fine-grained expert + shared expert 相比 Mixtral 的 Top-2 路由有哪些工程差异？
  5. MLA（multi-head latent attention）在 KV cache 压缩上相对 GQA 多走了什么？

###  指标 & 评估 

  1. MFU 和 HFU 的区别？工业级训练的典型水平是多少？
  2. vLLM 的 PagedAttention 为什么能把 KV cache 的显存碎片消掉？它借鉴了操作系统的哪个机制？
  3. 推理 SLO 该怎么分解：TTFT、TPOT、e2e latency 三者在请求分布不均时会矛盾吗？

## 核心概念

- [CUDA thread / block / grid](https://docs.nvidia.com/cuda/cuda-c-programming-guide/)

  GPU 编程模型的最基础抽象。不理解它就没法谈 kernel 性能调优和 occupancy。

- [Shared memory / warp](https://developer.nvidia.com/blog/using-shared-memory-cuda-cc/)

  warp 是 GPU 调度和执行的最小单位；shared memory 是 block 内线程通信的高速通道，是写高性能 kernel 的核心工具。

- [Memory coalescing](https://developer.nvidia.com/blog/how-access-global-memory-efficiently-cuda-c-kernels/)

  让一个 warp 的 32 个线程合并成一次访存事务，是 GPU 带宽打满的前置条件。

- [Data / Tensor / Pipeline Parallel](https://arxiv.org/abs/2104.04473)

  Megatron-LM 系统论文，把三种并行组合使用的工程方案讲得最清楚。训练大模型绕不开。

- [ZeRO](https://arxiv.org/abs/1910.02054)

  把优化器状态、梯度、参数分片到数据并行组内，是现代大模型训练（DeepSpeed、FSDP）的理论基础。

- [KV Cache](https://huggingface.co/docs/transformers/main/en/kv_cache)

  自回归生成必备的中间状态缓存。它决定了 LLM 推理显存的下限和调度的上限。

- [PagedAttention](https://arxiv.org/abs/2309.06180)

  vLLM 的核心贡献，把虚拟内存分页思想用到 KV Cache 上，显著减少碎片。

- [Continuous Batching](https://www.anyscale.com/blog/continuous-batching-llm-inference)

  按 token 粒度动态拼 batch，而不是按 request 等齐。对 LLM 推理吞吐的提升通常 2-10 倍。

- [Speculative Decoding](https://arxiv.org/abs/2211.17192)

  小模型先起草、大模型批量验证，在不改模型质量的前提下降低 latency 的主流手段。

- [FlashAttention](https://arxiv.org/abs/2205.14135)

  通过 tiling 和 recomputation 把 attention 的 HBM 访问降到最低。是过去几年最重要的 kernel 级优化之一。

## Lab

- [dlsys needle 作业](https://dlsyscourse.org/)

  陈天奇团队的深度学习系统课，从 autograd 一路实现到 CUDA kernel，系统性地过一遍 DL 框架。

- [CMU 15-418 作业](https://www.cs.cmu.edu/~15418/)

  并行计算经典课，ISPC、CUDA、MPI 都有作业。打底 GPU 编程心智模型的最佳选择。

- [复现 llm.c](https://github.com/karpathy/llm.c)

  Karpathy 用纯 C / CUDA 实现 GPT 训练。读完对训练 loop、算子实现会有从 PyTorch 黑盒到透明盒的转变。

- [yalm：从零写 LLM 推理引擎](https://github.com/andrewkchan/yalm)

  Andrew Chan 的纯 C++/CUDA 单卡推理实现，零外部依赖。Mistral-7B 上 63.8 tok/s，和 llama.cpp 打平甚至更快。llm.c 管训练，yalm 管推理，是同一维度上的互补项目。

- [GPU Puzzles](https://github.com/srush/GPU-Puzzles)

  Sasha Rush 的 14 道交互式小题，专治 warp / shared memory / reduce 这些易错点。几小时能建立 GPU 直觉。

- [手写 autograd](https://github.com/karpathy/micrograd)

  一百多行 Python 实现反向传播。理解它之后，PyTorch 的 computation graph 就不再神秘。

- [Triton 入门](https://triton-lang.org/main/getting-started/tutorials/index.html)

  OpenAI 的 GPU DSL，门槛比 CUDA 低很多。FlashAttention、fused 算子的主流实现语言。

- [读 vLLM 源码](https://github.com/vllm-project/vllm)

  PagedAttention、continuous batching 的开源实现。推理性能优化的第一手材料。

## 资料

- [Attention Is All You Need](https://arxiv.org/abs/1706.03762)

  Vaswani 等人 2017 年的原始 Transformer 论文。所有 LLM 基础设施的共同地基，self-attention、multi-head、positional encoding 都出自这里。

- [Mixed Precision Training](https://arxiv.org/abs/1710.03740)

  NVIDIA 2017 年的 fp16 训练奠基作。loss scaling、master weights 这一整套现代训练默认配置都源自它。

- [GPipe](https://arxiv.org/abs/1811.06965)

  Google 的 pipeline parallelism 开山之作，把模型按层切段、micro-batch 流水填充 bubble。今天的 1F1B、interleaved 1F1B、zero-bubble 都是它的迭代。

- [Megatron-LM](https://arxiv.org/abs/1909.08053)

  NVIDIA 的大模型训练系统论文。Tensor Parallel 的权威出处。

- [Megatron-3D（SC'21）](https://arxiv.org/abs/2104.04473)

  Megatron 团队在 SC'21 的续作，把 data / tensor / pipeline 三维并行在上千块 A100 上跑通。现代大模型训练系统的事实参考架构，几乎所有 LLM 训练团队都以此为起点。

- [ZeRO 论文](https://arxiv.org/abs/1910.02054)

  DeepSpeed 团队的分片优化器论文。FSDP 和现代大模型训练的理论基础。

- [Switch Transformer](https://arxiv.org/abs/2101.03961)

  Google 把 MoE 推到万亿参数规模。Top-1 routing、load balancing loss、expert capacity 的工程选择深远影响了 Mixtral、DeepSeek MoE 等一整代模型。

- [FlashAttention](https://arxiv.org/abs/2205.14135)

  IO-aware 算子设计的教科书案例。读完能理解 HBM vs SRAM 带宽对 kernel 设计的决定性影响。

- [FlashAttention-2](https://arxiv.org/abs/2307.08691)

  Tri Dao 的 v2：重分配 thread block、压缩非 matmul 指令，A100 上 attention kernel 再快 2x。今天几乎所有推理框架的默认 attention 实现。

- [FlashAttention-3](https://arxiv.org/abs/2407.08608)

  Hopper 专版：利用 wgmma、TMA 异步、warp specialization，在 H100 上做到接近硬件 SOL 的 fp16/fp8 attention。

- [Orca（OSDI'22）](https://www.usenix.org/conference/osdi22/presentation/yu)

  Continuous batching + iteration-level scheduling 的奠基论文。vLLM、TensorRT-LLM、SGLang 背后所有调度器的思想源头。

- [vLLM PagedAttention](https://arxiv.org/abs/2309.06180)

  系统视角看 LLM 推理的里程碑论文。把调度和显存管理问题正式化。

- [DistServe（OSDI'24）](https://arxiv.org/abs/2401.09670)

  Prefill / decode 分离部署的代表作。在延迟和吞吐之间用 PD 解耦做出新的 Pareto 前沿，当前推理栈最重要的架构趋势之一。

- [Speculative Decoding](https://arxiv.org/abs/2211.17192)

  Leviathan 等人 2022 年的原始论文。小模型起草 + 大模型并行验证的范式，Medusa、EAGLE、Lookahead 都是它的后代。

- [GPTQ](https://arxiv.org/abs/2210.17323)

  一次前向就能做 INT4 post-training 量化，几乎无精度损失。llama.cpp / HuggingFace 生态里绝大多数 INT4 权重都走这条路。

- [AWQ](https://arxiv.org/abs/2306.00978)

  Activation-aware weight quantization：按激活分布挑出"重要 channel"保留高精度。和 GPTQ 各占半壁江山，是当前生产级 INT4 的两大主线。

- [MLIR 论文](https://arxiv.org/abs/2002.11054)

  LLVM 团队面向 AI / 异构编译的新 IR 基础设施。理解它有助于看懂现代编译栈的分层。

- [TVM 论文](https://arxiv.org/abs/1802.04799)

  深度学习编译器的代表作，schedule / compute 分离的思想深远影响了 Triton、Halide 社区。

- [Fast LLM Inference From Scratch](https://andrewkchan.dev/posts/yalm.html)

  yalm 作者 Andrew Chan 的配套长文。从 naive 实现逐层推到工业水平：OpenMP + AVX、warp reduction、kernel fusion、attention kernel、KV cache 量化、手动 unroll 和 prefetch。近几年讲推理优化最清楚的一篇单机视角长文。

## 工具

- [PyTorch](https://github.com/pytorch/pytorch)

  事实标准的深度学习框架。几乎所有开源模型以 PyTorch checkpoint 为主要发行形式。torch.compile / FSDP2 / DTensor 是当前生态的核心新能力。

- [JAX](https://github.com/jax-ml/jax)

  Google 推的函数式深度学习框架，基于 XLA 编译。在 TPU 和大规模训练（Gemini、Mixtral 等）上优势明显。

- [Megatron-LM](https://github.com/NVIDIA/Megatron-LM)

  NVIDIA 的开源大模型训练框架。tensor / pipeline / sequence 并行的参考实现，GPT-3 规模以上训练的共同起点。

- [TorchTitan](https://github.com/pytorch/torchtitan)

  PyTorch 团队 2024 年推的 native 4D 并行训练库。不依赖 Megatron，直接用 DTensor / FSDP2，是 PyTorch 自己的训练参考实现。

- [DeepSpeed](https://github.com/microsoft/DeepSpeed)

  微软的训练优化库，ZeRO 的主要实现。训练大模型的常见选型之一。

- [TransformerEngine](https://github.com/NVIDIA/TransformerEngine)

  NVIDIA 的 fp8 训练 / 推理 kernel 库，Hopper / Blackwell 上跑 fp8 模型的事实标准。和 Megatron-LM 深度集成。

- [accelerate](https://github.com/huggingface/accelerate)

  HuggingFace 的多卡 / 混合精度 / FSDP 封装层，适合从单卡到多卡快速过渡。

- [FlashAttention](https://github.com/Dao-AILab/flash-attention)

  FlashAttention 论文的官方实现（含 v1 / v2 / v3）。PyTorch 2.2+ 的 SDPA 直接集成了它。

- [xformers](https://github.com/facebookresearch/xformers)

  Meta 开源的高效 Transformer 算子库，memory-efficient attention、SwiGLU、ALiBi 等算子都在里面。

- [Triton](https://github.com/openai/triton)

  写 GPU kernel 比 CUDA 容易一个数量级。生产级 fused attention、量化 kernel 的主要实现语言。

- [vLLM](https://github.com/vllm-project/vllm)

  当前事实上的 LLM 推理引擎。PagedAttention + continuous batching 的工业实现。

- [TensorRT-LLM](https://github.com/NVIDIA/TensorRT-LLM)

  NVIDIA 旗舰 LLM 推理引擎。高并发下相比 vLLM 还能再快 30-50%，代价是编译步骤复杂、模型覆盖窄一些。大厂生产推理几乎都在用。

- [SGLang](https://github.com/sgl-project/sglang)

  后起之秀。RadixAttention 让 prefix cache 命中率极高；在 DeepSeek-V3 等新架构上常跑赢 vLLM。结构化生成 / 多轮对话场景的首选。

- [llama.cpp](https://github.com/ggerganov/llama.cpp)

  纯 C/C++ 的本地推理引擎，Mac Metal / CPU / CUDA / Vulkan 通吃。GGUF 格式 + INT4 量化是消费级本地 LLM 的事实标准。

- [TGI](https://github.com/huggingface/text-generation-inference)

  HuggingFace 的推理服务，早期最受欢迎的生产方案。官方已转入维护模式、推荐切 vLLM / SGLang，但存量部署仍然巨大。

- [bitsandbytes](https://github.com/bitsandbytes-foundation/bitsandbytes)

  int8 / nf4 量化的事实标准运行时。QLoRA、HuggingFace Transformers 的 load_in_8bit / load_in_4bit 背后都是它。

- [Unsloth](https://github.com/unslothai/unsloth)

  针对 LoRA / QLoRA 的定制 Triton kernel，相比原生 HuggingFace 快 2x、显存少 50%+。消费级 GPU 微调的首选。

- [Ray](https://github.com/ray-project/ray)

  分布式 Python 计算框架，Ray Train / Ray Serve / Ray Data 一整套 ML 基础设施。vLLM、SGLang 的多机部署都走它。

- [PyTorch profiler](https://pytorch.org/tutorials/recipes/recipes/profiler_recipe.html)

  分析训练 / 推理性能的第一道工具，能看到算子级 CPU / GPU 时间和 memory 分配。

- [Nsight](https://developer.nvidia.com/nsight-systems)

  NVIDIA 官方 GPU profiler。kernel 级性能分析、SM 占用率、访存瓶颈都靠它。

