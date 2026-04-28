---
title: "分布式系统"
order: 4
slug: "distributed"
---

分布式系统是讨论「当机器、网络、时钟都可能骗你时，还能得到什么保证」的学问。这个模块的目标是建立词汇表：一致性模型、共识、复制、故障模型，让你在读论文、设计存储或排查线上诡异故障时有共同语言。

## 学完后你应该能回答

###  一致性模型 & 理论 

  1. 为什么 CAP 的 C 和 ACID 的 C 不是同一个 C？分区发生时实际工程里如何权衡 A 与 C？
  2. FLP 不可能性说的是"异步系统无法共识"，Raft 为什么又能工作？它到底绕过了哪个假设？
  3. 线性一致性、顺序一致性、因果一致性、最终一致性，请给出四个能区分它们的具体反例。
  4. BFT vs CFT 的阈值差异（n ≥ 3f+1 vs n ≥ 2f+1）？区块链之外还有哪些场景必须上 BFT？
  5. PACELC 相比 CAP 多补了什么维度？它更贴近实际系统选型的哪一面？

###  共识 & 复制 

  1. Raft 选举时为什么要求候选人日志"至少和大多数一样新"？否则会出什么问题？
  2. 一个 5 节点集群能容忍几台故障？把集群扩到 7 台能获得什么、失去什么？
  3. 2PC 的阻塞问题具体是什么场景？Paxos / Raft 如何避免这种阻塞？
  4. Raft 的 read index 和 lease read 分别怎么实现线性一致读？代价各是多少？
  5. Joint consensus（共同一致）是什么？为什么 Raft 用它做配置变更而不直接切换？
  6. Raft snapshot + log compaction 解决了什么问题？follower 落后太多时 install snapshot 的流程是什么？
  7. Multi-Paxos、EPaxos、Raft 三者在跨地域部署时延迟模型有什么差别？

###  事务 & MVCC 

  1. 事务隔离级别（RC / RR / SI / SSI / Serializable）各自允许哪些异象？为什么 Snapshot Isolation 不是可串行的？
  2. Percolator / Omid 等跨分片事务模型的核心思路是什么？和 2PC 有什么差异？
  3. MVCC 下一次事务看到的快照是怎么确定的？vacuum / GC 为什么是 MVCC 系统逃不开的代价？
  4. 悲观锁 vs 乐观锁在跨分片事务里的 tail latency 差异？OCCC 在冲突率高的工作负载下为什么会崩？
  5. Deterministic database（Calvin / FaunaDB）相比两阶段提交减少了什么？代价是什么？

###  时钟 & 时序 

  1. Spanner 的 TrueTime 给出什么保证？没有 GPS+原子钟的团队该怎么近似实现外部一致性？
  2. Lamport 时钟、向量时钟、HLC 各自能给出什么保证？HLC 在 CockroachDB 里起什么作用？
  3. 在最终一致的系统里，如何用版本向量或 CRDT 合并并发写，而不靠时钟？
  4. NTP 偏移 50ms 会让典型分布式 DB 出什么问题？leader lease 最小能设多短？

###  工程实践 & 故障 

  1. 一致性哈希 vs range 分片的取舍？虚拟节点（vnode）解决了什么问题？
  2. Split brain 发生的条件？lease + fencing token 如何组合防止"两个 leader"同时写？
  3. Jepsen 报告里最常见的五类一致性 bug 是什么？为什么早期 MongoDB 屡屡中招？
  4. Gray failure（半死节点）相比 crash failure 为什么更难处理？哪些系统有针对性设计？
  5. Chaos engineering 在生产做成常态化有哪些前置条件？和 Jepsen-style 模型检查的互补点？

## 核心概念

- [CAP 定理](https://en.wikipedia.org/wiki/CAP_theorem)

  分区发生时，一致性和可用性二选一。被滥用最严重的概念之一，搞清楚它说了什么、没说什么很重要。

- [FLP 不可能性](https://groups.csail.mit.edu/tds/papers/Lynch/jacm85.pdf)

  异步网络 + 一个可能崩溃的节点，就没有确定性共识算法。知道它才理解为什么 Raft 要引入超时。

- [线性一致性](https://jepsen.io/consistency/models/linearizable)

  最强的单对象一致性模型：每个操作看起来都在某个瞬间原子生效。etcd、ZooKeeper 提供的就是这个。

- [最终一致性](https://jepsen.io/consistency/models)

  Dynamo、Cassandra 代表的弱一致性模型。Jepsen 的模型图是这个领域最清晰的一张参考图。

- [Leader election](https://en.wikipedia.org/wiki/Leader_election)

  绝大多数共识和复制协议的第一步。弄清楚「谁说了算」是所有一致性讨论的起点。

- [Log replication](https://raft.github.io/)

  把操作变成可回放的日志、复制到多数派、再应用到状态机。现代存储系统的底层模式。

- [Quorum / 多数派](https://en.wikipedia.org/wiki/Quorum_\(distributed_computing\))

  R + W > N 这类算术约束。理解它才能推导出一个系统在某种配置下的一致性强度。

- [两阶段提交 2PC](https://en.wikipedia.org/wiki/Two-phase_commit_protocol)

  跨资源事务的经典做法，也是阻塞 / 协调者单点问题的经典反面教材。

## Lab

- [MIT 6.5840 Lab 2: Raft](https://pdos.csail.mit.edu/6.824/labs/lab-raft.html)

  在 Go 里从零实现 Raft。做完这个才真正理解选举、日志匹配、安全性这些概念。

- [MIT 6.5840 Lab 3: KVRaft](https://pdos.csail.mit.edu/6.824/labs/lab-kvraft.html)

  在 Lab 2 的 Raft 上搭一个线性一致 KV。学会幂等和客户端会话怎么处理重复请求。

- [MIT 6.5840 Lab 4: ShardKV](https://pdos.csail.mit.edu/6.824/labs/lab-shard.html)

  多 Raft 组 + 分片迁移。接近真实分布式 KV（TiKV、CockroachDB）的架构。

- [PingCAP Talent Plan](https://github.com/pingcap/talent-plan)

  PingCAP 设计的分布式系统训练课，偏工程向。是 MIT 课之外的一条实战补充路径。

- [dragonboat 示例](https://github.com/lni/dragonboat-example)

  生产级 Go 版 Multi-Raft 库的示例项目。对比自己的 Lab 2 能学到很多工程细节。

- [TigerBeetle 仿真测试](https://tigerbeetle.com/blog/2023-07-11-we-put-a-distributed-database-in-the-browser)

  把一个分布式数据库塞进浏览器跑确定性仿真的案例。看懂它你就懂了现代故障注入测试的上限。

## 资料

- [GFS 论文](https://static.googleusercontent.com/media/research.google.com/en//archive/gfs-sosp2003.pdf)

  Google 文件系统原论文。HDFS 和一大批分布式存储都是它的后代，范式意义大于细节。

- [MapReduce 论文](https://static.googleusercontent.com/media/research.google.com/en//archive/mapreduce-osdi04.pdf)

  开启了大数据时代的模型。今天你未必用 MR 了，但它对失败处理、重试的思路影响了一整代系统。

- [Raft 论文](https://raft.github.io/raft.pdf)

  刻意为可理解性设计的共识算法。读完加一遍 Lab 2 基本就吃透共识了。

- [Paxos Made Simple](https://lamport.azurewebsites.net/pubs/paxos-simple.pdf)

  Lamport 自己写的「简化版」。虽然仍然烧脑，但是理解 Raft 为什么长那样的必读。

- [Spanner 论文](https://static.googleusercontent.com/media/research.google.com/en//archive/spanner-osdi2012.pdf)

  全球分布式强一致数据库，TrueTime 是关键创新。现在所有强一致云数据库都在追它。

- [Dynamo 论文](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)

  最终一致 KV 的范式。NWR、vector clock、gossip、一致性哈希几个概念集中展示。

- [DDIA](https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/)

  Kleppmann 的《数据密集型应用系统设计》。这个模块唯一推荐通读一遍的书。

- [Martin Kleppmann 博客](https://martin.kleppmann.com/)

  DDIA 作者的博客。对一致性模型、时钟、流处理的思考比书里更新、更犀利。

## 工具

- [Jepsen](https://jepsen.io/)

  Kyle Kingsbury 的分布式系统故障测试框架和博客。写分布式存储的人最该定期读的报告。

- [etcd](https://etcd.io/)

  生产级 Raft 实现，Kubernetes 的底层存储。阅读它的源码比读论文更贴近工程。

- [ZooKeeper](https://zookeeper.apache.org/)

  老牌的协调服务，基于 ZAB 协议。大量老系统的一致性原语（锁、选主）都跑在它上面。

- [TLA+](https://lamport.azurewebsites.net/tla/tla.html)

  Lamport 的形式化规约语言。用来在代码之前把协议模型写出来、让模型检查器帮你找 bug。

- [Chaos Mesh](https://chaos-mesh.org/)

  Kubernetes 上的混沌工程平台。注入网络分区、节点宕机、延迟，用来验证系统真的能挺住。

- [toxiproxy](https://github.com/Shopify/toxiproxy)

  轻量级网络故障注入代理。在集成测试里模拟分区和延迟非常顺手。

