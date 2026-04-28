---
title: "网络与 RPC"
order: 3
slug: "network"
---

网络是后端工程师每天都在用、却很少真正读过 RFC 的一层。这个模块的目标不是把你训练成协议专家，而是让你能看懂抓包、能解释一次 HTTPS 请求发生了什么、能判断一个性能问题是出在握手、拥塞控制还是应用层。

## 学完后你应该能回答

###  TCP / 传输层 

  1. 为什么三次握手够了、两次不行？四次挥手中的 TIME_WAIT 存在的意义是什么？
  2. 一条新建的 TCP 连接从慢启动进入拥塞避免的临界点是什么？丢包时 Reno 和 CUBIC 的反应有何不同？
  3. BBR 和 CUBIC 的核心差异？为什么 BBR 更适合长肥管道，却在短连接主导的场景可能更差？
  4. Nagle 算法与 delayed ACK 组合会导致什么延迟 anti-pattern？TCP_NODELAY 什么时候该开、什么时候别开？
  5. MSS / MTU / Path MTU Discovery 的关系？MTU 1500 的链路叠加 VPN 后为什么会卡在 1400 多？
  6. 在 Wireshark 里如何一眼识别重传、乱序、零窗口这三种常见的 TCP 异常？
  7. Linux 的 tcp_wmem / tcp_rmem / tcp_mem 三层缓冲区怎么协作？高 BDP 链路上如何调？

###  HTTP / QUIC 

  1. HTTP/2 的多路复用解决了 HTTP/1.1 的什么问题？为什么它仍然受 TCP 队头阻塞影响，而 HTTP/3 不会？
  2. QUIC 为什么建在 UDP 上而不是新建一个传输层协议？它如何实现连接迁移？
  3. 一次 `curl https://example.com` 从 DNS 查询到收到首字节，依次经过哪些系统调用和网络往返？
  4. HTTP/1.1 的 chunked、keep-alive、pipelining 分别解决什么问题？pipelining 为什么没有流行？
  5. HTTP/3 的 0-RTT resumption 和 TLS 1.3 0-RTT 有什么关系？应用层要怎么防 replay？

###  TLS / 加密 

  1. TLS 1.3 相比 1.2 少了哪一轮 RTT？0-RTT 的安全代价是什么？
  2. mTLS 相比单向 TLS 多做了什么？service mesh 里 sidecar 自动注入 mTLS 的典型流程是什么？
  3. TLS 握手里 ECDHE、certificate、Finished 分别在做什么？PFS（前向安全）具体由哪一步保证？
  4. 证书吊销的 CRL / OCSP / OCSP stapling 路径分别有什么延迟 / 可用性问题？

###  RPC / 应用层 

  1. gRPC 是如何利用 HTTP/2 的 stream 和 trailer 实现双向流和状态码的？
  2. HTTP retry 的幂等性：哪些方法天然幂等？为什么客户端无脑重试可能引发雪崩？
  3. gRPC 的 deadline 怎么穿透到所有下游？metadata / header / context 的传播机制是什么？
  4. 客户端负载均衡（lookaside / proxyless xDS）和经典 L4/L7 代理相比各有什么取舍？

###  内核网络 / 负载均衡 

  1. Proxy protocol 解决的是什么问题？L4 负载均衡下真实客户端 IP 如何穿透到后端？
  2. ip_conntrack 表项打满的典型症状？什么场景适合干脆关掉 conntrack？
  3. Cilium / eBPF 替代 kube-proxy 相比 iptables / IPVS 在性能和可观测性上优势在哪？
  4. SO_REUSEPORT 和传统 bind 的区别？多进程监听同一端口时内核按什么策略分发？
  5. Linux 网卡的 RSS / RPS / RFS / XPS 分别在哪一层做流量分发？高 pps 场景怎么调？
  6. DPDK / XDP / AF_XDP 三条用户态收包路径的性能和编程模型差在哪？

## 核心概念

- [TCP 握手 / 挥手](https://datatracker.ietf.org/doc/html/rfc9293)

  RFC 9293 是 2022 年合订版的 TCP 规范。读它是为了搞清楚 SYN / ACK / FIN 的状态机，而不是背题。

- [TCP 拥塞控制](https://datatracker.ietf.org/doc/html/rfc5681)

  慢启动、拥塞避免、快速重传、快速恢复四件套。所有性能诡异现象几乎都能回到这张状态图上。

- [HTTP/1.1](https://datatracker.ietf.org/doc/html/rfc9112)

  至今仍是最多服务端实际处理的协议。理解 keep-alive、chunked、管线化的坑是底线。

- [HTTP/2](https://datatracker.ietf.org/doc/html/rfc9113)

  引入了二进制帧、多路复用和 HPACK。了解它才能读懂 gRPC、才知道为什么一个 TCP 卡住会拖垮所有 stream。

- [HTTP/3](https://datatracker.ietf.org/doc/html/rfc9114)

  HTTP 语义跑在 QUIC 上的版本。重点是它如何绕开 TCP 队头阻塞并支持连接迁移。

- [QUIC](https://datatracker.ietf.org/doc/html/rfc9000)

  在 UDP 上重建了可靠传输 + 加密 + 多路复用。是理解现代网络栈的新地基。

- [TLS 1.3](https://datatracker.ietf.org/doc/html/rfc8446)

  砍掉了一轮 RTT、淘汰了一堆不安全算法。知道它和 1.2 握手差异能帮你看懂几乎所有抓包。

- [DNS](https://datatracker.ietf.org/doc/html/rfc1035)

  请求链路里第一个可能失败的地方。理解递归解析、TTL、缓存是排障的前提。

- [gRPC 协议](https://github.com/grpc/grpc/blob/master/doc/PROTOCOL-HTTP2.md)

  官方文档，一页讲清楚 gRPC 如何编码到 HTTP/2 帧上。比读源码快得多。

## Lab

- [手写 TCP echo](https://beej.us/guide/bgnet/)

  用 socket API 实现一个 echo server / client。第一次知道 listen、accept、read、write 的真实形状。

- [实现简易 HTTP 服务器](https://docs.python.org/3/library/http.server.html)

  从解析请求行开始手写一个能响应 GET 的服务器。会让你对框架的黑盒祛魅。

- [Build Your Own X](https://github.com/codecrafters-io/build-your-own-x)

  各种从零实现项目的索引。网络相关的几个都值得选一个做完。

- [gRPC 官方 Quickstart](https://grpc.io/docs/languages/go/quickstart/)

  半小时跑通一个 gRPC 服务，然后去抓包看它到底在 HTTP/2 上发了什么。

- [tcpdump / Wireshark 抓包练习](https://wiki.wireshark.org/SampleCaptures)

  用官方样本包练习识别握手、重传、TLS ClientHello。看得多了才能在生产抓包里找到线索。

- [Codecrafters: HTTP server](https://codecrafters.io/challenges/http-server)

  分阶段关卡式实现 HTTP，包括持久连接和 gzip。比自己随便写更有约束力。

## 资料

- [《TCP/IP 详解 卷一》](https://www.informit.com/store/tcp-ip-illustrated-volume-1-the-protocols-9780321336316)

  Stevens 的经典。当工具书查，不用通读。

- [High Performance Browser Networking](https://hpbn.co/)

  Ilya Grigorik 的免费在线书，从物理层一直讲到 HTTP/2。性能视角最清晰的一本。

- [brpc 设计文档](https://github.com/apache/brpc/blob/master/docs/cn/overview.md)

  百度开源 RPC 框架的中文设计文档。工业级 RPC 考虑的问题都能在这里找到对应章节。

- [gRPC 设计与实现](https://grpc.io/blog/)

  官方博客里有不少关于 retry、xDS、流控的深度文章，比文档更接近工程实践。

- [Cloudflare QUIC 博客系列](https://blog.cloudflare.com/tag/quic/)

  一线落地者写的 QUIC / HTTP3 调优与踩坑记录。是理解真实部署挑战的最佳素材。

- [Beej's Guide to Network Programming](https://beej.us/guide/bgnet/)

  socket 编程入门天花板。写得像散文，又把每个 API 讲透了。

## 工具

- [tcpdump](https://www.tcpdump.org/)

  命令行抓包工具。服务器上排查问题的第一选择，过滤表达式值得专门练。

- [Wireshark](https://www.wireshark.org/)

  图形化协议分析。把 tcpdump 抓到的包拉回本地，一点就能看到 TLS、HTTP/2 帧的解析结果。

- [iperf3](https://iperf.fr/)

  测带宽和丢包的标准工具。判断是网络问题还是应用问题时先跑一次。

- [mtr](https://www.bitwizard.nl/mtr/)

  traceroute + ping 的合体。排查跨机房、跨运营商丢包时非常直观。

- [curl](https://curl.se/)

  最通用的 HTTP 客户端。-v 配合 --trace 能打印几乎所有你想看到的细节。

- [toxiproxy](https://github.com/Shopify/toxiproxy)

  在 TCP 层注入延迟、丢包、带宽限制的代理。是做网络故障演练的轻量级选择。

