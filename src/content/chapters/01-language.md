---
title: "语言 · C++ / Rust / Go"
order: 1
slug: "language"
---

C++ 是几乎所有基础设施（数据库、浏览器、游戏引擎、推理运行时）的实现语言，Rust 正在数据库、浏览器、操作系统等领域接替它的位置，Go 则主导了云原生、RPC 和 CLI 工具链。这个模块不求三语样样精通，而是把三者的心智模型放在一起看：内存和生命周期怎么管、并发和异步怎么调度、哪套工具链能真正把你的代码送到 CPU 上。

## 学完后你应该能回答

###  C++ 

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

###  Rust 

  1. ownership + borrow checker 禁止了 C++ 能做的哪些操作？为什么能在编译期消掉 use-after-free？
  2. Lifetime 标注的作用是什么？什么时候要求你显式写 'a，什么时候会按 elision 规则自动推导？
  3. 为什么 Rust 不需要 garbage collector？RAII 和 ownership 如何一起保证资源释放？
  4. Send 和 Sync trait 分别说明了什么？为什么 Rc<T> 不是 Sync 但 Arc<T> 是？
  5. async/await + Future 的核心是什么？为什么 Rust async 是 zero-cost 但又需要 executor？Pin 又解决了什么？
  6. Unsafe Rust 开了哪些特权？什么时候不得不用 unsafe？Miri 能帮你发现哪些违规？
  7. Interior mutability（Cell / RefCell / Mutex）背后的类型系统契约是什么？
  8. trait object 的 fat pointer 长什么样？为什么不是所有 trait 都能 dyn（object safety 是什么）？
  9. declarative macro 和 procedural macro 分别适合什么场景？为什么 serde / tokio 离不开 proc-macro？
  10. 为什么错误是 Result<T, E> 而不是异常？? 操作符等价于什么代码，它和 Try trait 的关系？

###  Go 

  1. Goroutine 比 OS 线程轻到什么程度？GMP 调度器怎么决定一次抢占？基于信号的异步抢占（1.14+）解决了什么？
  2. channel 的底层数据结构（hchan）是什么？buffered / unbuffered 在唤醒语义上有什么不同？
  3. GC 是 concurrent mark-and-sweep，write barrier 解决了什么问题？当前 STW 的典型耗时是多少？
  4. error 约定为什么不用异常？errors.Is / errors.As / wrap 机制为什么到 1.13 才引入？
  5. memory model 的 happens-before 是怎么定义的？channel send / receive 的同步语义保证了什么？
  6. context.Context 的正确用法？cancel 信号怎么穿透到底层 syscall？
  7. interface 的 itab 是什么？一次 interface 方法调用比普通函数调用贵多少？
  8. generics（1.18+）是如何实现的？为什么选 GC shape stenciling 而不是每类型一份特化？
  9. sync.Pool 解决了什么问题？它在 GC 时的行为是什么？
  10. sync.Map 和 map + Mutex 什么时候各自更快？为什么一般代码不该默认用 sync.Map？

###  跨语言对比 

  1. 三种错误处理模型（C++ 异常 / Rust Result / Go error）对 API 设计和 ABI 稳定性各有什么影响？
  2. Rust async、C++ coroutine、Go goroutine 的运行时开销和心智模型差在哪？为什么 Rust / C++ 选 stackless、而 Go 选 stackful？
  3. C++ RAII、Rust ownership、Go defer 三种资源管理思路的异同？各自能 / 不能处理哪些场景？
  4. C++ template、Rust generics + trait、Go generics + type constraint 三套泛型机制的编译产物和错误提示差在哪？
  5. 三种语言的构建系统（CMake / Bazel、cargo、go build）在增量编译、依赖管理、可复现性上的工程取舍？

## C++

### 核心概念

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

### Lab

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

### 资料

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

### 工具

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

## Rust

### 核心概念

- [Ownership & borrowing](https://doc.rust-lang.org/book/ch04-00-understanding-ownership.html)

  一个值只能有一个 owner；可以同时有多个 &T 共享引用或一个 &mut T 独占引用，两者不并存。C++ 里所有 lifetime bug 的源头这里被直接禁掉。

- [Lifetimes](https://doc.rust-lang.org/book/ch10-03-lifetime-syntax.html)

  编译器需要知道引用活多久才能防悬垂。大多数情况推断，剩下要你显式写 'a。

- [Traits & generics](https://doc.rust-lang.org/book/ch10-02-traits.html)

  类似 Haskell type class + C++ concept。零成本抽象和 trait bound 都走它。

- [Result / Option / ?](https://doc.rust-lang.org/book/ch09-00-error-handling.html)

  没有异常，错误走类型系统。? 操作符让错误传播零样板。

- [Send / Sync](https://doc.rust-lang.org/nomicon/send-and-sync.html)

  marker trait 告诉编译器哪些类型可跨线程、可跨共享引用。数据竞争被编译期消灭。

- [async/await + Future](https://rust-lang.github.io/async-book/)

  Future 是惰性状态机，tokio / async-std 是轮询它的 executor。zero-cost 但需要运行时。

- [Unsafe Rust](https://doc.rust-lang.org/nomicon/)

  一块 unsafe 换来写 raw pointer、FFI、底层数据结构的能力。大部分标准库背后都有它。

- [Interior mutability](https://doc.rust-lang.org/book/ch15-05-interior-mutability.html)

  Cell / RefCell / Mutex / RwLock 把「外表不可变内部可改」塞进类型系统。

- [Pattern matching & enums](https://doc.rust-lang.org/book/ch06-00-enums.html)

  match + tagged union 让「不可能的状态」不可表达。

- [宏（declarative + proc-macro）](https://doc.rust-lang.org/book/ch19-06-macros.html)

  宏系统是 serde、tokio、sqlx 生态的基石，也是编译期元编程的官方机制。

### Lab

- [Rustlings](https://github.com/rust-lang/rustlings)

  官方交互式练习。几小时把 ownership / lifetimes / traits 的肌肉记忆建起来。

- [The Rust Book 项目](https://doc.rust-lang.org/book/)

  书里的 grep 克隆、多线程 web server 等练手项目。官方书 + 动手的组合。

- [Writing an OS in Rust](https://os.phil-opp.com/)

  从零在 x86 上写内核，no_std / unsafe 的实战场景。

- [手写 HashMap](https://doc.rust-lang.org/std/collections/struct.HashMap.html)

  不用 std::collections，自己实现开地址哈希。把 Rust 泛型和 cache locality 一起摸透。

- [Tokio async server](https://tokio.rs/tokio/tutorial)

  手写一个 tokio 上的 echo / HTTP server，亲历 async 心智模型。

- [Rust by Example](https://doc.rust-lang.org/rust-by-example/)

  官方配套代码样例站，查单点用法特别快。

### 资料

- [The Rust Programming Language](https://doc.rust-lang.org/book/)

  官方书，入门读这一本就够。

- [Rust for Rustaceans](https://rust-for-rustaceans.com/)

  Jon Gjengset 的进阶书，覆盖 trait 对象、unsafe、async 实战。

- [Programming Rust](https://www.oreilly.com/library/view/programming-rust-2nd/9781492052586/)

  Blandy / Orendorff / Tindall 的大部头系统入门。

- [Rustonomicon](https://doc.rust-lang.org/nomicon/)

  官方讲 unsafe Rust 的「黑书」，写 FFI / 底层代码必看。

- [Asynchronous Programming in Rust](https://rust-lang.github.io/async-book/)

  官方 async book，讲清 Future / Pin / executor 为什么长这样。

- [Jon Gjengset YouTube](https://www.youtube.com/@jonhoo)

  深度直播编程，讲 async runtime、trait 对象等进阶话题。

- [This Week in Rust](https://this-week-in-rust.org/)

  社区周报，追生态和 nightly 特性。

### 工具

- [cargo](https://doc.rust-lang.org/cargo/)

  包管理 + 构建 + 测试 + benchmark 的统一入口。

- [clippy](https://doc.rust-lang.org/clippy/)

  官方 lint，抓无效模式和风格问题。

- [rustfmt](https://github.com/rust-lang/rustfmt)

  官方格式化工具。Rust 社区对代码风格争论极少。

- [rust-analyzer](https://rust-analyzer.github.io/)

  LSP 服务器，提供 IDE 智能提示 / 补全 / 跳转。

- [miri](https://github.com/rust-lang/miri)

  MIR 解释器，抓 unsafe 代码里的 UB（越界、未初始化、数据竞争）。

- [cargo-expand](https://github.com/dtolnay/cargo-expand)

  展开宏成普通 Rust 代码，调试 proc-macro 必备。

- [cargo-flamegraph](https://github.com/flamegraph-rs/flamegraph)

  一条命令生成火焰图，定位热点。

## Go

### 核心概念

- [Goroutine & GMP 调度器](https://go.dev/src/runtime/proc.go)

  M 个 OS thread 上多路复用 G 个 goroutine，内置 work-stealing。

- [channel](https://go.dev/ref/spec#Channel_types)

  goroutine 间通信原语，底层 hchan = ringbuf + 等待队列 + 锁。

- [select + context](https://pkg.go.dev/context)

  多路 channel 选择 + 跨层级传递的取消 / 超时信号。

- [interface](https://go.dev/ref/spec#Interface_types)

  隐式鸭子类型，运行时 itab 做方法分派。interface{} / any 是类型擦除。

- [GC（concurrent mark-and-sweep）](https://go.dev/doc/gc-guide)

  并发三色标记 + write barrier，STW 目标 < 1ms，代价是内存开销和 CPU 占用。

- [defer / panic / recover](https://go.dev/blog/defer-panic-and-recover)

  退栈时执行 + 异常机制的有限替代，慎用 panic。

- [sync package](https://pkg.go.dev/sync)

  Mutex / RWMutex / WaitGroup / Once / atomic，标准锁语义。

- [generics（1.18+）](https://go.dev/doc/tutorial/generics)

  类型参数 + type constraint，迟到但核心。

- [error handling](https://go.dev/blog/go1.13-errors)

  错误是值，errors.Is / errors.As / fmt.Errorf 的 %w 动词做错误链。

- [Go memory model](https://go.dev/ref/mem)

  happens-before 规范，channel / mutex / atomic 的同步保证。

### Lab

- [A Tour of Go](https://go.dev/tour/)

  官方交互式教程，2 小时过一遍语法和并发。

- [Go by Example](https://gobyexample.com/)

  主题化代码样例站，查 snippet 最快。

- [写一个小型 HTTP 框架](https://pkg.go.dev/net/http)

  在 net/http 之上加路由、中间件、context 穿透，能力边界看得清。

- [gRPC 服务](https://grpc.io/docs/languages/go/quickstart/)

  用 protoc-gen-go 出 stub，实现服务端 + 客户端 + 拦截器，顺带练 proto3。

- [实现限流器 / 连接池](https://pkg.go.dev/golang.org/x/time/rate)

  channel + sync 组合的经典练习。

- [Writing an Interpreter in Go](https://interpreterbook.com/)

  Thorsten Ball 的书，从零写 Monkey 解释器，顺带吃透 Go。

### 资料

- [The Go Programming Language](https://www.gopl.io/)

  Donovan / Kernighan 的官方级入门书。

- [Effective Go](https://go.dev/doc/effective_go)

  官方风格和惯用法指南。

- [Go 101](https://go101.org/)

  进阶细节集合，覆盖大量边角语义。

- [Go 官方博客](https://go.dev/blog/)

  设计决策、新版本分析的第一手来源。

- [Practical Go（Dave Cheney）](https://dave.cheney.net/practical-go)

  工程实践讲义，Go 代码组织和测试的正道。

- [Russ Cox 博客](https://research.swtch.com/)

  Go 团队 lead 的深度分析，语言和工具链决策都有。

- [Go memory model](https://go.dev/ref/mem)

  happens-before 规范原文，写并发代码前看一遍不亏。

### 工具

- [go build / test / run](https://pkg.go.dev/cmd/go)

  一体化工具链，零配置上手。

- [go vet](https://pkg.go.dev/cmd/vet)

  官方静态检查，抓 printf 参数不对等常见错误。

- [gofmt / goimports](https://pkg.go.dev/golang.org/x/tools/cmd/goimports)

  格式化 + import 排序。Go 不讨论风格。

- [golangci-lint](https://golangci-lint.run/)

  社区 lint 合集，CI 标配。

- [delve (dlv)](https://github.com/go-delve/delve)

  Go 专用 debugger，看 goroutine、channel 状态必备。

- [pprof](https://pkg.go.dev/net/http/pprof)

  集成 profiler，CPU / heap / block / mutex 一把全能抓。

- [race detector](https://go.dev/blog/race-detector)

  加 -race 编译就能跑数据竞争检测，测试里常开。

