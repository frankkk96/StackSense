---
title: "操作系统与网络"
order: 5
slug: "os-network"
---

这一层是上面所有 infra 真正落地的地方：操作系统给你进程、内存、文件、IO 这些抽象；网络栈把字节装进包、按地址找到对端、再保证有序送到。绝大多数性能问题、故障定位最后都要下沉到这一层来回答。

## 学完后你应该能回答

### 操作系统

  1. 一次系统调用从 user space 到 kernel space 走的是哪条路？x86 上 `syscall` 指令做了什么？
  2. 进程和线程的真实差别是什么（Linux 视角下其实都是 task_struct）？为什么 fork + exec 的设计影响了 50 年？
  3. 虚拟内存里页表四层结构、TLB、缺页处理大概的流程？mmap 和 read 在 IO 路径上差在哪？
  4. CFS 调度器怎么用红黑树挑下一个任务？vruntime 又是怎么补偿的？为什么 EEVDF 在替代它？
  5. epoll 比 select / poll 强在哪？io_uring 又解决了 epoll 解决不了的什么问题？
  6. 文件系统的 inode、dentry、page cache、journal 各是什么？write back 模型下 fsync 真正保证什么？

### 计算机网络

  1. TCP 三次握手、慢启动、拥塞控制、close 状态机这些"老问题"，BBR 之后做了哪些工程级改动？
  2. TLS 1.3 的握手相比 1.2 减掉了什么 round trip？0-RTT 的安全代价是什么？
  3. HTTP/2 的多路复用解决了什么 HTTP/1.1 解决不了的问题？HOL blocking 又被 QUIC 怎么再解决？
  4. RDMA 怎么绕过内核做零拷贝传输？RoCE 和 InfiniBand 在数据中心里怎么取舍？
  5. gRPC 在 HTTP/2 之上做了哪些事？流式 RPC 跟普通 RPC 的工程差别？
  6. 用 eBPF + tc / XDP 做包过滤为什么比 iptables 快？Cilium 的工程价值在哪？

## 核心概念

### 操作系统

- [系统调用](https://man7.org/linux/man-pages/man2/syscalls.2.html)

  user space 跟 kernel 唯一的官方接口。strace 一下 hello world 就能看到现代程序至少调用几十个 syscall。

- [虚拟内存 / 页表](https://www.kernel.org/doc/html/latest/admin-guide/mm/index.html)

  把每个进程的"看起来连续"的地址空间映射到物理页。理解了它你才懂 OOM、mmap、零拷贝。

- [进程调度](https://docs.kernel.org/scheduler/)

  CFS / EEVDF / RT scheduler。`taskset`、`nice`、`cgroup CPU` 改的都是它的输入。

- [VFS / 文件系统](https://www.kernel.org/doc/html/latest/filesystems/index.html)

  ext4、btrfs、xfs 都遵循 VFS 的接口；page cache、direct IO、async IO 都建在上面。

- [epoll / io_uring](https://kernel.dk/io_uring.pdf)

  Linux 高性能 IO 的两大引擎；nginx、Redis、ScyllaDB 都依赖它们。

- [cgroup / namespace](https://man7.org/linux/man-pages/man7/cgroups.7.html)

  容器的真实底层；docker / containerd 只是把这两套机制包了一层。

### 网络协议

- [TCP/IP](https://datatracker.ietf.org/doc/html/rfc9293)

  四层模型 + 拥塞控制，是几乎所有网络通信的底色。

- [TLS 1.3](https://datatracker.ietf.org/doc/html/rfc8446)

  现代 HTTPS 默认协议，握手 1-RTT，可选 0-RTT。

- [HTTP/2 + HTTP/3 / QUIC](https://datatracker.ietf.org/doc/html/rfc9000)

  多路复用 + 拥塞控制移到用户态。后来 RPC 框架几乎都在它上面。

- [gRPC](https://grpc.io/)

  Google 把 protobuf + HTTP/2 + 流式 RPC 合在一起的现代 RPC 框架。

- [RDMA / RoCE / InfiniBand](https://en.wikipedia.org/wiki/Remote_direct_memory_access)

  数据中心高带宽低延迟传输；分布式训练里跨节点的 NCCL 几乎都靠它。

- [eBPF + XDP](https://ebpf.io/)

  在内核里跑安全的字节码程序；可观察性、网络、安全三个方向都在重写工具链。

## 代表项目

- [Linux kernel](https://github.com/torvalds/linux) — 看一遍 socket / TCP / VFS 的源码
- [xv6](https://github.com/mit-pdos/xv6-riscv) — MIT 教学用的精简 Unix，从头理解一遍 OS
- [nginx](https://github.com/nginx/nginx) — 高性能反向代理，事件驱动 + 进程模型的范本
- [Cilium](https://github.com/cilium/cilium) — eBPF + 容器网络的工程示例

## 资料

- [Operating Systems: Three Easy Pieces](https://pages.cs.wisc.edu/~remzi/OSTEP/) — OS 入门首选
- [MIT 6.S081](https://pdos.csail.mit.edu/6.S081/) — 在 xv6 上写 OS lab
- [Beej's Guide to Network Programming](https://beej.us/guide/bgnet/) — socket 编程入门
- [TCP/IP Illustrated, Vol. 1](https://www.pearson.com/en-us/subject-catalog/p/tcpip-illustrated-volume-1-the-protocols/P200000009281) — Stevens 的协议大全
- [Linux 内核文档](https://www.kernel.org/doc/html/latest/)
