---
title: "并行计算与硬件加速"
order: 4
slug: "parallel-computing"
---

现代 AI / HPC 工作负载几乎不再跑在 CPU 上。这一层覆盖让代码真正用起加速器的能力：GPU 编程模型、ML 算子库、跨节点通信、HPC 范式。学完这一层，你才知道为什么"同一个模型在不同框架上延迟差几倍"——大多数答案在这里。

## 学完后你应该能回答

  1. CUDA 的 thread block / warp / SM 三层模型是什么？warp divergence 为什么会拖慢 kernel？
  2. shared memory、L1、L2、HBM 之间的带宽和延迟差距分别有多大？怎么用 occupancy 和 roofline 模型推断瓶颈？
  3. Tensor Core 跟普通 CUDA core 的指令差别是什么？FP16 / BF16 / FP8 / INT4 的硬件支持各代怎么变？
  4. cuBLAS 和你手写 GEMM 之间到底差在哪？什么时候 hand-tuned kernel 还能赢？
  5. NCCL 的 ring all-reduce 和 tree all-reduce 各自适合什么拓扑？为什么大模型训练几乎只用它？
  6. ROCm 和 CUDA 的差距正在缩小吗？对应到 PyTorch / vLLM 上的实际工程成本？
  7. MPI 在 HPC 圈子里地位怎么来的？为什么 AI 训练不直接用它？
  8. FlashAttention 是怎么用 shared memory tiling 把 attention 的 IO 复杂度从 O(N²) 降到 O(N) 的？

## 核心概念

- [CUDA 编程模型](https://docs.nvidia.com/cuda/cuda-c-programming-guide/)

  thread / block / grid + shared memory + warp，是写所有 NVIDIA GPU kernel 的基本词汇。

- [PTX](https://docs.nvidia.com/cuda/parallel-thread-execution/)

  NVIDIA GPU 的虚拟 ISA；CUDA C++ 编译到它，再由 ptxas 编到具体 SM 架构的 SASS。

- [CUDA 内存层级](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#memory-hierarchy)

  registers → shared memory → L1 / L2 → HBM → host memory。带宽和延迟差几个数量级，决定 kernel 设计。

- [Tensor Core](https://www.nvidia.com/en-us/data-center/tensor-cores/)

  NVIDIA 从 Volta 起加入的矩阵乘单元；一条 MMA 指令完成 16x16x16 FP16 → FP32。

- [cuDNN](https://developer.nvidia.com/cudnn)

  NVIDIA 的深度学习算子库；conv、attention、norm 等核心算子的事实标准实现。

- [cuBLAS](https://developer.nvidia.com/cublas)

  矩阵运算库，GEMM 跑得最稳的那一份。

- [NCCL](https://developer.nvidia.com/nccl)

  GPU 间集合通信库，all-reduce / all-gather / broadcast 全在这里；分布式训练的脊柱。

- [MPI](https://www.mpi-forum.org/)

  HPC 经典通信协议，OpenMPI / MPICH 是常见实现。Megatron 的某些场景下还在用。

- [ROCm](https://rocm.docs.amd.com/)

  AMD 的对应栈：HIP、rocBLAS、RCCL；HIP 和 CUDA 的 API 高度相似。

- [Triton](https://github.com/openai/triton)

  写 GPU kernel 的高级 DSL；TorchInductor 大量用它。比裸 CUDA 简洁很多。

- [Roofline model](https://en.wikipedia.org/wiki/Roofline_model)

  把 kernel 性能按"算术强度 vs 内存带宽"画成一条折线，是性能调优第一步。

## 代表项目

- [FlashAttention](https://github.com/Dao-AILab/flash-attention) — IO-aware attention 的开创性实现
- [CUTLASS](https://github.com/NVIDIA/cutlass) — NVIDIA 官方的 GEMM 模板库
- [Triton](https://github.com/openai/triton) — OpenAI 的 GPU kernel DSL
- [DeepSpeed Inference](https://github.com/microsoft/DeepSpeed) — kernel + 通信优化的工程实例

## 资料

- [PMPP（Programming Massively Parallel Processors）](https://www.elsevier.com/books/programming-massively-parallel-processors/hwu/978-0-323-91231-0) — GPU 编程教科书
- [GPU Mode](https://www.youtube.com/@GPUMODE) — 系列讲座，覆盖 kernel 优化、量化、训练
- [How GPU Computing Works](https://developer.nvidia.com/blog/how-gpu-computing-works/) — NVIDIA 自己的科普
- [CUDA Programming Guide](https://docs.nvidia.com/cuda/cuda-c-programming-guide/)
- [NVIDIA GTC 录像](https://www.nvidia.com/gtc/) — 工业一线的最新做法
