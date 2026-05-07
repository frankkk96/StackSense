---
title: "计算机体系结构"
order: 6
slug: "architecture"
---

整个栈最底下、最不容易过时的一层：CPU 怎么执行指令、cache 怎么布局、虚拟内存怎么工作、不同 ISA 的设计取舍是什么。infra 的所有性能问题——延迟、吞吐、能耗——最后都要回到这一层来解释。

## 学完后你应该能回答

  1. 一条指令从取指、译码、执行、访存到写回，在现代乱序超标量 CPU 上是怎么并行的？为什么 IPC 能 > 1？
  2. CPU cache 的三级层级（L1/L2/L3）容量和延迟分别是多少？cache line 为什么是 64 字节？
  3. cache miss 分哪几类（compulsory / capacity / conflict / coherence）？怎么用 perf 量出来？
  4. 分支预测错误的代价是多少 cycle？为什么 hot path 要尽量让 if 结果可预测？
  5. NUMA 上的"远端访问"比"本地访问"贵多少？数据库和 JVM 为什么都要绑核？
  6. DRAM 和 HBM 的带宽差距数量级？什么样的 workload 会卡在内存带宽而不是 CPU？
  7. Spectre / Meltdown 是怎么利用乱序执行 + cache 时序泄漏数据的？硬件 / 软件层面分别怎么缓解？
  8. AVX-512 vs ARM SVE vs RISC-V V 扩展，三种 SIMD 思路在编程模型和移植性上差在哪？

## 核心概念

- [CPU 流水线 / 乱序执行](https://en.wikipedia.org/wiki/Instruction_pipelining)

  现代 CPU 同时跑十几条指令的根基。理解了它你才看得懂 stall、port 竞争、IPC 这些性能词汇。

- [分支预测 / 推测执行](https://en.wikipedia.org/wiki/Branch_predictor)

  现代 CPU 靠猜下一条指令维持流水线。理解它才知道为什么 hot path 要尽量让 if 可预测，以及 Spectre 系列攻击为什么存在。

- [Cache 层级](https://en.wikipedia.org/wiki/CPU_cache)

  L1 / L2 / L3 + cache line + 一致性协议（MESI / MOESI）；几乎所有性能优化都在围绕"让数据待在更高一层"。

- [虚拟内存与 TLB](https://en.wikipedia.org/wiki/Translation_lookaside_buffer)

  分页机制把"地址翻译"从软件挪到硬件。huge page、TLB shootdown、PTE 构成了所有 OS 内存管理的硬件接口。

- [NUMA](https://en.wikipedia.org/wiki/Non-uniform_memory_access)

  多 socket 服务器上，本地节点内存比远端快几倍。数据库、JVM、推理引擎都要做 NUMA binding。

- [SIMD 与向量寄存器](https://en.wikipedia.org/wiki/Single_instruction,_multiple_data)

  AVX2 / AVX-512 / NEON / SVE：一条指令同时处理多个数据，是现代 CPU 提速的主要来源之一。

- [ISA（x86 / ARM / RISC-V）](https://en.wikipedia.org/wiki/Instruction_set_architecture)

  软硬件之间的合同；不同架构的设计取舍直接决定了上层语言运行时的样子。

- [内存带宽 / Roofline](https://en.wikipedia.org/wiki/Roofline_model)

  很多号称 CPU-bound 的任务其实卡在 DRAM 带宽。先用 stream benchmark 和 roofline 画清楚算术强度 vs 带宽的上限。

- [硬件性能计数器](https://en.wikipedia.org/wiki/Hardware_performance_counter)

  perf / VTune / pmu-tools 直接读 CPU 内部的事件计数（cycles、cache miss、branch miss、port stall），是性能分析的最底层工具。

## 资料

- [Computer Systems: A Programmer's Perspective (CSAPP)](https://csapp.cs.cmu.edu/) — 体系结构入门事实教科书
- [Computer Architecture: A Quantitative Approach](https://www.elsevier.com/books/computer-architecture/hennessy/978-0-12-811905-1) — Hennessy & Patterson 的圣经
- [What every programmer should know about memory](https://people.freebsd.org/~lstewart/articles/cpumemory.pdf) — Ulrich Drepper 的经典长文
- [Agner Fog 优化手册](https://www.agner.org/optimize/) — x86 微架构级别的圣经，包含每代 CPU 的指令延迟表
- [Intel Optimization Manual](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html) — Intel 官方优化手册
- [MIT 6.004 / 6.S081 课程](https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/) — 体系结构 + OS 公开课
