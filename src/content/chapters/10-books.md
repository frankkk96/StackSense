---
title: "必读经典书"
order: 10
slug: "books"
---

前面九章的"资料"里散落着各章自己的推荐书。这一章把它们里面真正经得起十年时间检验的那些抽出来，按主题归到一起：你可以把它当成一份桌面书目——不必本本通读，但搞 infra 这一行至少得知道它们存在、出过什么问题该翻哪本。

## 系统基础

- [CSAPP（深入理解计算机系统）](https://csapp.cs.cmu.edu/)

  从位运算讲到 cache、链接、虚拟内存。读完后看任何 C/C++/汇编代码都不会迷失在抽象层下面。

- [Crafting Interpreters](https://craftinginterpreters.com/)

  从零用 C 实现一个带 GC 的字节码解释器。读完会真正懂语言运行时是怎么回事。免费在线。

- [SICP（计算机程序的构造和解释）](https://mitp-content-server.mit.edu/books/content/sectbyfn/books_pres_0/6515/sicp.zip/index.html)

  MIT 经典，Lisp 派的计算机科学圣经。"用程序定义抽象"的思维起点。

- [Introduction to Algorithms (CLRS)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)

  算法参考手册级。不必通读，但每个搞 infra 的桌面或硬盘里都该有一本。

## 操作系统 & Linux

- [OSTEP（Operating Systems: Three Easy Pieces）](https://pages.cs.wisc.edu/~remzi/OSTEP/)

  免费、易读，现代 OS 课首选教材。三个支柱：虚拟化、并发、持久化。

- [The Linux Programming Interface (TLPI)](https://man7.org/tlpi/)

  Michael Kerrisk 的 1500 页 Linux syscall 圣经。任何 syscall 的边界条件都查得到。

- [Linux Kernel Development](https://www.oreilly.com/library/view/linux-kernel-development/9780768696974/)

  Robert Love 写的 Linux 内核入门首选，讲清进程、调度、VFS、网络栈这些核心子系统。

- [Understanding the Linux Kernel](https://www.oreilly.com/library/view/understanding-the-linux/0596005652/)

  Bovet & Cesati，更深更老，但讲 kernel 数据结构和算法仍是标杆。

- [Modern Operating Systems](https://www.pearson.com/en-us/subject-catalog/p/modern-operating-systems/P200000003311/9780137618873)

  Tanenbaum 的 OS 教材，学院派标准参考。

## 网络

- [Computer Networking: A Top-Down Approach](https://gaia.cs.umass.edu/kurose_ross/index.php)

  Kurose & Ross，本科网络课的标准教材，从 HTTP 自顶向下讲到物理层。

- [TCP/IP Illustrated, Vol 1](https://www.oreilly.com/library/view/tcpip-illustrated-volume/9780132808200/)

  W. Richard Stevens，用 tcpdump 抓包驱动的 TCP/IP 课。Stevens 是网络教学的祖师爷。

- [Unix Network Programming, Vol 1](https://www.oreilly.com/library/view/unix-network-programming/0131411551/)

  Stevens，sockets API 圣经，所有网络代码作者的案头书。

- [High Performance Browser Networking](https://hpbn.co/)

  Ilya Grigorik，TCP / TLS / HTTP/2 / WebRTC 一套讲完，免费在线。

## 分布式系统

- [Designing Data-Intensive Applications (DDIA)](https://dataintensive.net/)

  Martin Kleppmann。Infra 工程师必读 No.1：复制、分区、共识、流批，全在一本里。

- [Distributed Systems](https://www.distributed-systems.net/index.php/books/ds4/)

  van Steen & Tanenbaum，学院派教材，讲清概念定义。和 DDIA 互补，免费 PDF。

- [Database Internals](https://www.databass.dev/)

  Alex Petrov。从 B-Tree / LSM 讲到 Raft / Paxos，DDIA 的工程实现补充版。

- [Patterns of Distributed Systems](https://martinfowler.com/articles/patterns-of-distributed-systems/)

  Unmesh Joshi 在 Martin Fowler 站上的免费章节，把分布式系统抽成可复用的设计模式。

## 数据库 / 数据系统

- [Readings in Database Systems (Red Book)](http://www.redbook.io/)

  Stonebraker & Hellerstein 主编的论文导读，第 5 版仍是数据库入坑路径。免费在线。

- [Database System Concepts](https://www.db-book.com/)

  Silberschatz et al，数据库本科教材标准参考。

- [Streaming Systems](https://www.oreilly.com/library/view/streaming-systems/9781491983867/)

  Akidau / Chernyak / Lax（Google Dataflow 论文作者）。事件时间 / watermark / window 的权威解释。

## AI / 机器学习

- [Deep Learning（花书）](https://www.deeplearningbook.org/)

  Goodfellow / Bengio / Courville，深度学习标准教材。免费在线。

- [Pattern Recognition and Machine Learning (PRML)](https://www.microsoft.com/en-us/research/people/cmbishop/prml-book/)

  Christopher Bishop，贝叶斯 / 概率图模型派的经典。免费 PDF。

- [The Elements of Statistical Learning (ESL)](https://hastie.su.domains/ElemStatLearn/)

  Hastie / Tibshirani / Friedman，统计学习的圣经。免费 PDF。

- [Designing Machine Learning Systems](https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/)

  Chip Huyen，从数据到 deploy 的 ML 系统工程闭环。

- [AI Engineering](https://www.oreilly.com/library/view/ai-engineering/9781098166298/)

  Chip Huyen 续作，聚焦基础模型 / RAG / 评估的工程实践。

## GPU / 高性能

- [Programming Massively Parallel Processors (PMPP)](https://www.elsevier.com/books/programming-massively-parallel-processors/hwu/978-0-323-91231-0)

  Kirk & Hwu，CUDA 教材的金标准，第 4 版覆盖到 Hopper。

- [CUDA C++ Programming Guide](https://docs.nvidia.com/cuda/cuda-c-programming-guide/)

  NVIDIA 官方手册，可以当字典查，也值得通读一遍打底。

- [What every programmer should know about memory](https://people.freebsd.org/~lstewart/articles/cpumemory.pdf)

  Ulrich Drepper 的长文，地位等同书，CPU cache / NUMA / prefetch 的内在原理。

- [Computer Architecture: A Quantitative Approach](https://www.elsevier.com/books/computer-architecture/hennessy/978-0-12-811905-1)

  Hennessy & Patterson，体系结构圣经，新版加了 GPU 章节。

## 语言

### C++

- [Effective Modern C++](https://www.oreilly.com/library/view/effective-modern-c/9781491908419/)

  Scott Meyers，C++11/14 的 42 个条款。从老式 C++ 切到现代 C++ 的最快路径。

- [The C++ Programming Language](https://www.stroustrup.com/4th.html)

  Bjarne Stroustrup 自己写的大部头，权威级参考。

- [C++ Concurrency in Action](https://www.manning.com/books/c-plus-plus-concurrency-in-action-second-edition)

  Anthony Williams，并发 C++ 的标准参考。

### Rust

- [The Rust Programming Language](https://doc.rust-lang.org/book/)

  官方"The Book"，入门必读。

- [Programming Rust](https://www.oreilly.com/library/view/programming-rust-2nd/9781492052586/)

  Blandy / Orendorff / Tindall，大部头系统入门。

- [Rust for Rustaceans](https://rust-for-rustaceans.com/)

  Jon Gjengset，进阶必读：trait object、unsafe、async 都讲透。

### Go

- [The Go Programming Language](https://www.gopl.io/)

  Donovan & Kernighan，Go 的 K&R。

- [Concurrency in Go](https://www.oreilly.com/library/view/concurrency-in-go/9781491941294/)

  Katherine Cox-Buday，channel / context / goroutine pattern 的标准参考。

- [100 Go Mistakes](https://www.manning.com/books/100-go-mistakes-and-how-to-avoid-them)

  Teiva Harsanyi，把 Go 工程里反复出错的 100 个坑系统讲一遍。

## 性能 / 工程实践

- [Systems Performance](https://www.brendangregg.com/systems-performance-2nd-edition-book.html)

  Brendan Gregg，工业级性能分析方法论圣经，USE 方法论出处。

- [BPF Performance Tools](http://www.brendangregg.com/bpf-performance-tools-book.html)

  Brendan Gregg，eBPF 实战手册。

- [Site Reliability Engineering (SRE Book)](https://sre.google/sre-book/table-of-contents/)

  Google 出品，SRE 方法论的开山之作。免费在线。

- [The Site Reliability Workbook](https://sre.google/workbook/table-of-contents/)

  SRE Book 的实战续集，给具体怎么落地。免费在线。

- [Database Reliability Engineering](https://www.oreilly.com/library/view/database-reliability-engineering/9781491925935/)

  Campbell & Majors，把 SRE 思路套到数据库运维上。

