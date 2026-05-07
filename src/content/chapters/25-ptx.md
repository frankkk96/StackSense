---
title: "PTX"
order: 25
slug: "ptx"
---

> 这一页还没写完。PTX 是 NVIDIA GPU 的虚拟 ISA：CUDA C++ 编译到 PTX，再由 ptxas 编到具体 SM 架构的 SASS。读懂 PTX 是分析 kernel 性能、绕过编译器局限、用 `asm volatile` 内联汇编的前提。

## 暂时先看这些

- [Parallel Thread Execution (PTX) ISA](https://docs.nvidia.com/cuda/parallel-thread-execution/)
- [Inline PTX Assembly in CUDA](https://docs.nvidia.com/cuda/inline-ptx-assembly/)
- [Compiler Explorer](https://godbolt.org/) — 把 CUDA 编到 PTX / SASS 看一眼
- [NVIDIA SASS / Maxas](https://github.com/NervanaSystems/maxas) — 超过编译器极限的人写的工具链
- [Dissecting the NVidia Turing T4](https://arxiv.org/abs/1903.07486) — 微架构反向工程
