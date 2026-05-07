---
title: "C++"
order: 12
slug: "cpp"
---

C++ 是几乎所有基础设施（数据库、浏览器、游戏引擎、推理运行时）的实现语言。它的难点不在语法本身，而在于：内存和生命周期怎么管、并发和异步怎么调度、如何把抽象写成真正零开销，以及怎么在大型代码库里写出别人能维护的代码。

## 学完后你应该能回答

  1. RAII 到底解决了什么问题？为什么说它比 try/finally 或 defer 更彻底？
  2. unique_ptr / shared_ptr / weak_ptr 各自适用场景？shared_ptr 的引用计数是线程安全的，那它指向的对象呢？
  3. 移动语义相比拷贝能带来什么？什么情况下一个看起来该 move 的对象其实发生了拷贝？NRVO / RVO 又什么时候能完全消掉拷贝？
  4. 列举 3 个常见 UB（有符号溢出、越界、严格别名），编译器为什么可以因此删代码？
  5. memory_order_relaxed / acquire / release / seq_cst 区别是什么？什么时候可以放心用 relaxed？
  6. 异常 vs 错误码的工程权衡？为什么 Google、LLVM 和很多嵌入式项目都禁用异常？
  7. 虚函数的 vtable 实现是什么样的？final / override 对编译器去虚化（devirtualization）的实际帮助在哪？
  8. 两个线程分别写各自的计数器还会互相拖慢吗？怎么用 perf c2c 或 cache-miss 事件确认 false sharing？
  9. 模板实例化和 concept（C++20）有什么取舍？为什么很多库开始用 concept 替换 enable_if？
  10. C++20 coroutine 底层长什么样？promise_type、suspend point、coroutine_handle 各做什么？
  11. constexpr / consteval / if consteval 分别在编译期和运行期起什么作用？
  12. pimpl 惯用法解决了 ABI 稳定和编译隔离的哪些问题？代价又是什么？

## 核心概念

- [RAII](https://en.cppreference.com/w/cpp/language/raii)

  用对象生命周期绑定资源释放，是 C++ 资源管理的底层范式。理解它才能看懂智能指针、锁守卫、文件句柄的设计。

- [智能指针](https://en.cppreference.com/w/cpp/memory)

  unique_ptr / shared_ptr / weak_ptr 把裸指针的所有权显式化。正确使用能消掉绝大部分 leak 和 double-free。

- [移动语义](https://en.cppreference.com/w/cpp/language/move_constructor)

  让昂贵的资源转移而不是深拷贝。读现代 C++ 代码必须理解右值引用、std::move 和返回值优化。

- [const 正确性](https://en.cppreference.com/w/cpp/language/cv)

  const 是类型系统层面的只读契约，不只是注释。接口设计时 const 放的位置直接决定调用方能做什么。

- [模板 / STL](https://en.cppreference.com/w/cpp/language/templates)

  模板是 C++ 泛型和零开销抽象的基础，STL 容器 / 算法是你读任何 C++ 项目都会碰到的词汇。

- [链接与编译](https://en.wikipedia.org/wiki/Compiler)

  搞清楚预处理、编译、汇编、链接四阶段各做什么。链接错误、ODR 违反、符号可见性问题都绕不开这层理解。

- [UB 常见来源](https://en.cppreference.com/w/cpp/language/ub)

  未定义行为不是 bug 而是编译器可以假设它不发生。知道常见坑（越界、未初始化、别名）才能避开。

- [内存模型](https://en.cppreference.com/w/cpp/language/memory_model)

  C++11 起有了正式的内存模型，决定了原子操作的可见性顺序。写任何 lock-free 代码前必须先理解它。

- [Cache line](https://en.wikipedia.org/wiki/CPU_cache#Cache_entries)

  CPU 与内存之间的最小传输单位，通常 64 字节。数据结构对齐、padding、热字段聚簇都从这里出发。

- [False sharing](https://en.wikipedia.org/wiki/False_sharing)

  多个线程改同一 cache line 里的不同字段，会触发 cache line ping-pong。是并发代码里最隐蔽的性能杀手之一。

- [分支预测](https://en.wikipedia.org/wiki/Branch_predictor)

  现代 CPU 靠猜下一条指令维持流水线。写 hot path 时尽量让 if 结果可预测，或者改写成无分支。

- [SIMD](https://en.wikipedia.org/wiki/Single_instruction,_multiple_data)

  一条指令同时处理多个数据，是向量化的根基。理解它才能读懂 ClickHouse、numpy、ffmpeg 的内循环。

- [NUMA](https://en.wikipedia.org/wiki/Non-uniform_memory_access)

  多路服务器上，本地节点内存快、远端慢。数据库、JVM、推理引擎都要调 NUMA binding。

- [内存带宽](https://en.wikipedia.org/wiki/Memory_bandwidth)

  很多号称 CPU-bound 的任务其实卡在 DRAM 带宽。先用 stream benchmark 和 roofline 画清楚上限。

- [CPU 流水线](https://en.wikipedia.org/wiki/Instruction_pipelining)

  乱序执行、超标量、退休这些概念是理解 IPC、stall、port 竞争的前提。

## Lab

- 写一个小型 allocator

  手写 bump / freelist / slab 分配器。逼你直面对齐、内存碎片和 placement new 这些平时被库挡住的东西。

- 实现 hash map

  不用 std::unordered_map，自己写一个开地址哈希。做完会对缓存局部性、rehash 策略、负载因子有肌肉记忆。

- LRU 缓存

  hash map + 双向链表的经典组合，面试常考，也是做内存 / 磁盘缓存的最小原型。

- 最小 shell

  fork / exec / wait / pipe / dup2 一次性过一遍。做完你再看 bash 或 systemd 源码就不会陌生。

- [Crafting Interpreters](https://craftinginterpreters.com/)

  从零用 C 写一个带 GC 的字节码解释器。写完会懂语言运行时、栈帧、垃圾回收是怎么回事。

- [Build-Your-Own-X](https://build-your-own.org/)

  从零实现数据库、Redis、Git 的开源教程集合。工程级 Lab 的好来源。

- [MIT 6.172 project](https://ocw.mit.edu/courses/6-172-performance-engineering-of-software-systems-fall-2018/pages/assignments/)

  工业级性能工程训练，从 bit hacks 到 cache-aware 算法一路走到底。

- [优化矩阵乘法](https://ocw.mit.edu/courses/6-172-performance-engineering-of-software-systems-fall-2018/)

  经典 warm-up：从 naive 三重循环优化到接近 BLAS 的 10-100x。一次把分块、向量化、多线程全摸一遍。

- [写 SIMD kernel](https://www.intel.com/content/www/us/en/docs/intrinsics-guide/index.html)

  挑一个算子（dot product、memcpy、argmax 之类）写 AVX2 / AVX-512 版本，再和编译器输出对比。

## 资料

- [Effective Modern C++](https://www.oreilly.com/library/view/effective-modern-c/9781491908419/)

  Scott Meyers 讲 C++11 / 14 的 42 个条款。从老式 C++ 切换到现代 C++ 的最快路径。

- [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

  Bjarne 和 Herb Sutter 主持的官方风格 / 实践清单。遇到设计分歧时能当仲裁者。

- [CSAPP 前六章](https://csapp.cs.cmu.edu/)

  数据表示、汇编、处理器、内存层级。让你在 C++ 层面看到的问题在机器层面能画得出来。

- [cppreference](https://en.cppreference.com/w/cpp)

  C++ 标准的工作参考手册，比 ISO 文档可读得多。写代码时一直开着就对了。

- [Google C++ Style](https://google.github.io/styleguide/cppguide.html)

  大型 C++ 代码库里怎么写才不会互相伤害的实战指南。不一定全盘接受，但值得读一遍理解为什么这么定。

- [Agner Fog 优化手册](https://www.agner.org/optimize/)

  x86 微架构级别的圣经，包含每代 CPU 的指令延迟表和优化建议。

- [What every programmer should know about memory](https://people.freebsd.org/~lstewart/articles/cpumemory.pdf)

  Ulrich Drepper 的经典长文，讲 CPU cache、NUMA、prefetch 的内在原理。

- [Intel Optimization Manual](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html)

  Intel 官方优化手册。遇到具体微架构问题时的权威查阅处。

- [MIT 6.172 讲义](https://ocw.mit.edu/courses/6-172-performance-engineering-of-software-systems-fall-2018/)

  MIT Leiserson 开的性能工程课，讲义和录像全部开放。

## 工具

- [gdb](https://sourceware.org/gdb/)

  Linux 下的标准调试器。看栈、设断点、读寄存器、分析 core dump，基础功每个系统方向的人都要有。

- [lldb](https://lldb.llvm.org/)

  LLVM 系调试器，macOS 默认的就是它。和 gdb 命令不完全一样，习惯 Clang 的人值得掌握。

- [ASan / UBSan / TSan](https://github.com/google/sanitizers)

  编译期插桩的动态检查器，分别抓内存错误、未定义行为、数据竞争。CI 跑一遍能省下无数个调试夜晚。

- [perf + FlameGraph](https://www.brendangregg.com/flamegraphs.html)

  Linux 上采样式性能分析，火焰图把 CPU 热点可视化。性能调优第一站。

- [Valgrind](https://valgrind.org/)

  通过动态二进制翻译检查内存错误，比 ASan 慢但不用重编译。适合分析已发布二进制。

- [clang-tidy](https://clang.llvm.org/extra/clang-tidy/)

  基于 Clang AST 的静态检查和自动修复工具。能按 Core Guidelines 或 Google Style 批量扫代码。

- [-Wall -Wextra -Wpedantic](https://gcc.gnu.org/onlinedocs/gcc/Warning-Options.html)

  GCC / Clang 的警告开关，把编译器变成免费的静态分析器。配合 -Werror 是进 CI 的基本礼仪。
