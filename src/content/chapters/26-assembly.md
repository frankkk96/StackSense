---
title: "汇编"
order: 26
slug: "assembly"
---

> 这一页还没写完。这里的"汇编"主要指 x86-64 / ARM64 / RISC-V 的机器汇编：性能调优、ABI 调试、看编译器到底生成了什么、写极致的 SIMD kernel，最终都要落到这里。后续会补寄存器约定、调用约定、AVX / NEON 指令、microbench 工具链等内容。

## 暂时先看这些

- [Compiler Explorer](https://godbolt.org/) — 把任何 C/C++/Rust 代码编到任何架构的汇编
- [Intel Software Developer's Manual](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html)
- [ARM Architecture Reference Manual](https://developer.arm.com/documentation/ddi0487/latest/)
- [RISC-V ISA Specifications](https://riscv.org/specifications/)
- [Agner Fog 的优化手册](https://www.agner.org/optimize/) — 包含每代 x86 CPU 的指令延迟和优化建议
