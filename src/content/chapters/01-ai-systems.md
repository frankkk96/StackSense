---
title: "AI 系统"
order: 1
slug: "ai-systems"
---

整个栈最靠近用户的一层。要回答的问题简单粗暴：怎么把模型训练好、再把它服务出去。训练把参数和优化器状态切到多卡多机，推理把 KV Cache、动态批调度、量化做到极致；编译器把动态算子图映射成 GPU 上的实际 kernel。这一层的工程目标，是让"模型 → 服务"这条路又快又便宜。

## 学完后你应该能回答

  1. 大模型训练为什么要 tensor / pipeline / data parallel 三种切分一起上？各自的瓶颈和通信开销是什么？
  2. ZeRO-1 / 2 / 3 分别把什么切到了不同 rank？什么情况下用 FSDP 比 ZeRO-3 更顺手？
  3. vLLM 的 PagedAttention 怎么把 KV Cache 的内存碎片化和 continuous batching 一起解决？
  4. TensorRT-LLM 的 plugin + kernel fusion 把延迟拉低到什么量级？跟 vLLM 各自适合什么场景？
  5. FlashAttention v1 / v2 / v3 各自靠什么把"内存带宽"变成它的瓶颈？
  6. PyTorch 2.x 的 torch.compile 走的是哪条编译链？跟 XLA / TVM 设计上差在哪？
  7. KV Cache 量化（FP8 / INT4）怎么做？精度损失和吞吐提升的取舍如何衡量？
  8. speculative decoding / lookahead decoding 这一类"草稿模型 + 验证"的加速思路，背后假设了什么？

## 核心概念

- [PyTorch](https://pytorch.org/)

  默认训练框架，动态图 + autograd + Distributed。理解 `nn.Module`、`autograd`、`DDP`、`FSDP` 是上层一切的前提。

- [JAX](https://jax.readthedocs.io/)

  函数式 + XLA 编译；Google 内部主力，TPU 上一等公民。`jit` / `vmap` / `pmap` 是它的精髓。

- [Megatron-LM](https://github.com/NVIDIA/Megatron-LM)

  NVIDIA 的大模型训练参考实现：tensor parallel、pipeline parallel、sequence parallel 写得最透。

- [DeepSpeed / ZeRO](https://www.deepspeed.ai/)

  ZeRO 系列把优化器状态 / 梯度 / 参数依次切到不同 rank，是大模型训练能放下的关键。

- [FSDP](https://pytorch.org/docs/stable/fsdp.html)

  PyTorch 原生 ZeRO-3 等价物，社区主流。

- [vLLM](https://github.com/vllm-project/vllm)

  开源推理引擎里集成度最高的：PagedAttention + continuous batching + tensor parallel + 量化全在一起。

- [TensorRT-LLM](https://github.com/NVIDIA/TensorRT-LLM)

  NVIDIA 官方推理框架；plugin 系统 + kernel fusion + in-flight batching。

- [SGLang](https://github.com/sgl-project/sglang)

  把"程序化调用 LLM"和后端推理优化绑在一起，结构化输出和 RAG 链场景见长。

- [FlashAttention](https://github.com/Dao-AILab/flash-attention)

  Tri Dao 开创的 IO-aware attention 实现，把 softmax 拆成 online 计算，显存带宽变上限。

- [torch.compile / TorchInductor](https://pytorch.org/docs/stable/torch.compiler.html)

  动态图捕获 → graph IR → Triton / C++ 代码生成，PyTorch 2.x 的官方编译链。

- [Triton](https://github.com/openai/triton)

  写 GPU kernel 的高级 DSL，比 CUDA C++ 简洁很多，TorchInductor 后端大量用它。

## 代表项目

- [vLLM](https://github.com/vllm-project/vllm) — 工业级开源推理引擎
- [Megatron-LM](https://github.com/NVIDIA/Megatron-LM) — 大模型训练教科书
- [DeepSpeed](https://github.com/microsoft/DeepSpeed) — ZeRO 起源地
- [llm.c](https://github.com/karpathy/llm.c) — Karpathy 用纯 C 实现 GPT-2 训练，一晚上读完
- [nanoGPT](https://github.com/karpathy/nanoGPT) — 极简训练实现，理解 transformer 训练流程的最短路径

## 资料

- [The Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/)
- [Karpathy: Let's build GPT](https://www.youtube.com/watch?v=kCc8FmEb1nY)
- [HuggingFace Blog](https://huggingface.co/blog) — 最新工程实践和 paper 解读
- [Tri Dao 主页](https://tridao.me/) — FlashAttention 系列的源头
