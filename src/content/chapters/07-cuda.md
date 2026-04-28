---
title: "CUDA / GPU 编程"
order: 7
slug: "cuda"
---

GPU 不是「多核 CPU」，它是为吞吐量设计的大规模并行机器：一个 SM 上几千个寄存器、上百 KB shared memory、上万线程同时在飞。这个模块从硬件视角把 CUDA 的执行模型、内存层级、同步原语拆明白，让你能自己写 kernel、读懂 CUTLASS / FlashAttention 的内循环、从 Nsight Compute 的 metric 就能判断该去哪里优化。

## 学完后你应该能回答

###  执行模型 & warp 

  1. kernel launch 从 host 发起到 GPU 开始执行，中间经过哪些层（driver、runtime、queue、command processor、SM）？一次 launch 的固定开销大概是多少？
  2. SM 里的 warp scheduler 每 cycle 发射几条指令？occupancy 100% 就一定最快吗？为什么 Volta 之后 occupancy 的重要性被削弱了？
  3. Warp divergence 是什么？同一 warp 里 16 个线程走 if、16 个走 else，硬件怎么执行？开销大致是多少？
  4. Cooperative Groups / grid.sync 适合什么场景？它和 persistent kernel 的组合能消掉什么 launch 开销？
  5. CUDA Graph 相比 per-launch 的收益主要来自哪？什么情况下它没有明显收益？

###  内存层级 & 访存 

  1. Shared memory 的 bank conflict 是怎么产生的？一个 warp 里 32 个线程访问同一 bank 不同地址，会被串行成几次事务？
  2. Register / Shared / L1 / L2 / HBM 的延迟和带宽大致分别是多少？给一个数据重用模式，你会把它放在哪一级？
  3. SM 上 shared memory 和 L1 合计 ~192 KB，kernel 配置怎么避免 register spill 落到 local memory？
  4. 向量化加载（float4、ldmatrix）能带来多大带宽提升？为什么写 GEMM 几乎必用？
  5. Unified memory（cudaMallocManaged）的 page migration 代价是什么？哪些场景应退回显式 cudaMemcpy？
  6. async copy（cp.async）相比传统 global→shared 走 register 的路径省了什么？Ampere 和 Hopper 的差别？

###  Tensor Core / MMA 

  1. Tensor Core 和普通 CUDA Core 的区别？wmma API 和直接写 mma PTX 指令各自的适用场景是什么？
  2. CUTLASS 3.x 的 CuTe 布局抽象相较 2.x 的 tile iterator 有哪些质的区别？
  3. wgmma（Hopper）相对 mma（Ampere）在执行粒度和异步性上的根本区别？
  4. FlashAttention-3 在 Hopper 上为什么又能快 1.5-2x？用到了 warp specialization 和 wgmma 的哪些特性？

###  多卡通信 

  1. cudaStream 之间的并发是怎么实现的？event / graph / barrier 三种同步方式各自的代价？
  2. NCCL 的 ring all-reduce 为什么在 NVLink 集群上能接近硬件带宽？到 64 卡规模时 tree 算法会不会更优？
  3. NVSwitch、NVLink、PCIe、InfiniBand 四种互联带宽/延迟量级大致是多少？训练集群怎么组拓扑？
  4. SHARP（NVIDIA in-network reduction）相比传统 ring all-reduce 能省多少？部署约束是什么？

###  新硬件 (Hopper / Blackwell) 

  1. Hopper 引入的 thread block cluster、distributed shared memory 提供了以前做不到的什么能力？
  2. TMA 的 swizzling 有哪几种？为什么配合 wgmma 时必须选对？
  3. fp8 tensor core（Hopper FP8 / Blackwell FP4）在训练 / 推理里有什么额外精度约束？
  4. Blackwell 的 2nd-gen Transformer Engine 和 FP4 tensor core 相比 Hopper 升级了什么？
  5. MPS (Multi-Process Service) 解决什么问题？和 MIG 在用法和隔离性上怎么取舍？

###  调优工具 

  1. Nsight Compute 里 SOL（Speed of Light）指标怎么解读？long scoreboard / short scoreboard / barrier 各对应什么根因？
  2. Nsight Systems 的 timeline 上怎么看出 CPU 发射不够快 vs GPU 真正闲着？
  3. nvcc 的 --ptxas-options=-v 输出里哪些字段最能指导你调 occupancy 和寄存器预算？

## 核心概念

- [GPU 架构（SM / warp scheduler / register file）](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#hardware-implementation)

  一个 SM 上的执行单元、寄存器文件、L1 / shared memory 布局直接决定 kernel 设计。搞清楚 SM 数量、warp 宽度、寄存器预算是所有调优的起点。

- [执行模型（grid / block / warp / thread）](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#programming-model)

  一个 block 在哪个 SM 上跑、一个 warp 怎么被调度，决定了 occupancy 和 latency hiding。不仅是概念，更要看它如何映射到硬件。

- [内存层级](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#memory-hierarchy)

  Register / Shared / L1 / L2 / Global / HBM 的带宽和延迟差两三个数量级。90% 的 GPU 性能优化都在回答「这块数据放哪一级」。

- [Memory coalescing](https://developer.nvidia.com/blog/how-access-global-memory-efficiently-cuda-c-kernels/)

  让一个 warp 的 32 个线程合并成一次 global memory 事务，是 HBM 带宽打满的前置条件。

- [Shared memory & bank conflict](https://developer.nvidia.com/blog/using-shared-memory-cuda-cc/)

  shared memory 被划分成 32 个 bank，同一 bank 的不同 word 会串行。padding 和 swizzle 是消冲突的两种标准手段。

- [Warp 原语](https://developer.nvidia.com/blog/using-cuda-warp-level-primitives/)

  shfl_sync / ballot_sync / reduce_sync 等 warp 内同步指令。写高性能 reduce、scan、transpose 都离不开。

- [Cooperative Groups](https://developer.nvidia.com/blog/cooperative-groups/)

  C++ API 层把 thread / warp / block / grid 级别的同步统一抽象起来。跨 block 协作（grid.sync）是写 persistent kernel 的基础。

- [CUDA Streams & Events](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#asynchronous-concurrent-execution)

  stream 是 GPU 上的 work queue，不同 stream 之间可以并发。把 compute、H2D、D2H 三条 stream 重叠是训练 / 推理的性能基本功。

- [Tensor Core / MMA](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#warp-matrix-functions)

  Volta 引入的矩阵乘加单元。wmma 是 C++ 层 API，mma PTX 指令是更底层的调用。cuBLAS、CUTLASS、FlashAttention 的性能都靠它。

- [Async copy / TMA](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#memcpy_async)

  Ampere 的 cp.async 让 global → shared 绕过寄存器，Hopper 的 TMA 再把拷贝批量化。现代高性能 kernel 默认都会用。

- [PTX / SASS](https://docs.nvidia.com/cuda/parallel-thread-execution/)

  PTX 是 NVIDIA 的虚拟 ISA，SASS 才是实际机器码。性能 debug 到最后一步经常要读 PTX 或反汇编。

## Lab

- [CUDA samples 仓库](https://github.com/NVIDIA/cuda-samples)

  官方样例覆盖从 vectorAdd 到 cooperative groups、CUDA Graph 的几十个示例。读 + 改 + 测，是最快的上手路径。

- [手写 SGEMM](https://siboehm.com/articles/22/CUDA-MMM)

  Simon Boehm 用 10 步把 naive matmul 优化到接近 cuBLAS 性能的经典文章。照着做一遍，shared memory tiling、register blocking、double buffering 会彻底内化。

- [Reduction kernel](https://developer.download.nvidia.com/assets/cuda/files/reduction.pdf)

  Mark Harris 的经典 7 版优化。从朴素两两相加到 warp shuffle，每一步都对应一个硬件约束的揭示。

- [GPU Mode lectures](https://github.com/gpu-mode/lectures)

  社区维护的 GPU 编程讲座资料集，话题从 warp 原语到 FlashAttention、Triton 全覆盖。

- [Triton tutorials](https://triton-lang.org/main/getting-started/tutorials/index.html)

  从 vector add 一路写到 fused attention。写 CUDA 之外，Triton 是做生产级 kernel 的现代起点。

- [复现 FlashAttention](https://github.com/Dao-AILab/flash-attention)

  读官方实现 + 自己写一版 tiled attention，做完会对 IO-aware 算子设计有直接感觉。

- [yalm：CUDA 推理 kernel 实战](https://github.com/andrewkchan/yalm)

  纯 C++/CUDA 的 LLM 推理实现，重点看 matmul warp reduction、kernel fusion、attention kernel、手动 unroll / prefetch。读完对 Nsight metric 到 kernel 改写的闭环会有很具体的感觉。

## 资料

- [CUDA C++ Programming Guide](https://docs.nvidia.com/cuda/cuda-c-programming-guide/)

  官方权威参考。programming model、hardware implementation、performance guidelines 三章是高频回看内容。

- [Fast LLM Inference From Scratch](https://andrewkchan.dev/posts/yalm.html)

  Andrew Chan 的 yalm 配套长文，讲 CUDA 推理优化最清楚的一篇：warp reduction、kernel fusion、KV cache 量化、手写 unroll 和 prefetch 为什么比 compiler 出的版本快。

- [CUDA C++ Best Practices Guide](https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/)

  把性能工作拆成 APOD 流程（Assess / Parallelize / Optimize / Deploy）。写新 kernel 前扫一遍能避开大量经典坑。

- [PMPP（第 4 版）](https://shop.elsevier.com/books/programming-massively-parallel-processors/hwu/978-0-323-91231-0)

  Hwu / Kirk 的 GPU 编程教科书。从并行思维到 stencil、reduce、scan、GEMM 的典型 pattern 一次过完。

- [PTX ISA 参考](https://docs.nvidia.com/cuda/parallel-thread-execution/)

  写 inline PTX、手写 mma 指令、读反汇编时的必备文档。

- [CUTLASS](https://github.com/NVIDIA/cutlass)

  NVIDIA 开源的 GEMM 模板库。读它的 tile iterator、pipeline、shape 模板，基本等于跟着 NVIDIA 工程师学现代 GEMM。

- [siboehm CUDA MMM](https://siboehm.com/articles/22/CUDA-MMM)

  当前网上讲 CUDA matmul 优化最清楚的一篇，把每一步的 metric 和 trade-off 画得很明白。

## 工具

- [nvcc](https://docs.nvidia.com/cuda/cuda-compiler-driver-nvcc/)

  CUDA 编译器驱动。-arch / -code、--ptxas-options=-v（打印寄存器 / 占用率）是调优第一步。

- [Nsight Compute](https://developer.nvidia.com/nsight-compute)

  kernel 级 profiler，给出 roofline、warp stall 原因、memory chart。写完 kernel 第一件事就是它。

- [Nsight Systems](https://developer.nvidia.com/nsight-systems)

  系统级 timeline profiler，看 CPU / GPU / CUDA stream / NCCL 的时序对齐。定位 stream 依赖和空转的主力。

- [Compute Sanitizer](https://docs.nvidia.com/compute-sanitizer/)

  GPU 上的 ASan 等价物，能抓越界、race、未初始化内存。CI 里定期跑一把能省下很多炸显存的夜晚。

- [cuda-gdb](https://docs.nvidia.com/cuda/cuda-gdb/)

  GPU 上的 gdb，可以在 kernel 内设断点、看 warp 状态。诊断 illegal memory access 的最终武器。

- [nvidia-smi / DCGM](https://developer.nvidia.com/nvidia-system-management-interface)

  看 SM 利用率、显存、温度、功耗的基础命令。DCGM 是集群版，直接暴露 Prometheus metric。

- [NCCL tests](https://github.com/NVIDIA/nccl-tests)

  多卡 / 多机集体通信带宽的官方基准。排查训练通信瓶颈时先跑一把 all_reduce_perf。

