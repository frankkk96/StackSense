---
title: "Rust"
order: 13
slug: "rust"
---

Rust 正在数据库、浏览器、操作系统等领域接替 C++ 的位置。它的核心卖点不是语法新颖，而是把 ownership + borrow checker 写进类型系统，编译期就消掉了一大类 use-after-free、data race、空指针 bug。这一页把 Rust 的关键心智模型集中放在一起。

## 学完后你应该能回答

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

## 核心概念

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

## Lab

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

## 资料

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

## 工具

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
