---
title: "分布式系统"
order: 3
slug: "distributed-systems"
---

数据系统是分布式系统的应用，分布式系统则是它们能成立的前提。这一层处理一个朴素的问题：当机器、网络、时钟都不可信时，还能保证什么？答案是一组核心抽象——复制、共识、一致性模型、容错、协调——上面所有的数据库、消息队列、对象存储、调度器都是这些抽象的产物。

## 学完后你应该能回答

  1. CAP 在工程上的真实含义是什么？为什么 PACELC 比 CAP 更准确？
  2. Paxos 和 Raft 都解决"复制状态机"问题，Raft 在工程上为什么更受欢迎？两者在 leader 选举和日志复制上的差异？
  3. linearizability、sequential consistency、causal consistency、eventual consistency 之间的边界在哪？分别牺牲了什么？
  4. Spanner 的 TrueTime 解决了什么 Lamport / vector clock 解决不了的问题？代价是什么？
  5. quorum-based 复制中 R + W > N 保证了什么？什么时候它不足以提供一致读？
  6. 两阶段提交的失败模式是什么？Percolator / 三阶段提交 / Saga 各自的工程取舍？
  7. gossip 协议为什么在大规模集群里比中心化协调更好？理论收敛性是怎样的？
  8. 时钟漂移、网络分区、慢节点这三种"故障"分别需要什么样的算法？

## 核心概念

- [Paxos](https://lamport.azurewebsites.net/pubs/paxos-simple.pdf)

  Lamport 的奠基论文。理解了它你才知道后来所有共识协议为什么这么设计。

- [Raft](https://raft.github.io/)

  Stanford 的工程化共识协议，目标就是"易理解"。etcd / TiKV / CockroachDB 都基于它。

- [一致性模型谱系](https://jepsen.io/consistency)

  Jepsen 维护的最权威一致性等级图。从 strict serializable 到 read uncommitted。

- [Linearizability](https://en.wikipedia.org/wiki/Linearizability)

  最强的单对象一致性。分布式锁、共识协议、TrueTime 的目标都是它。

- [Vector clock / Lamport clock](https://en.wikipedia.org/wiki/Vector_clock)

  没有全局时钟时，怎么定义事件的"先后"。理解了它才懂 CRDT、causality tracking。

- [CRDT](https://crdt.tech/)

  conflict-free replicated data type，无需协调就能并发更新的数据结构。Redis、Riak、Yjs 都用它。

- [Two-phase commit](https://en.wikipedia.org/wiki/Two-phase_commit_protocol)

  跨节点事务的基本协议；理解它的失败模式是后面所有分布式事务方案的入门。

- [Gossip](https://en.wikipedia.org/wiki/Gossip_protocol)

  Cassandra、Consul、Serf 的成员管理协议；epidemic 风格的扩散收敛极快。

- [TrueTime / HLC](https://research.google/pubs/spanner-googles-globally-distributed-database-2/)

  Spanner 用原子钟 + GPS 把"时间不确定区间"做小，HLC 用混合逻辑时钟近似它。

- [RPC](https://en.wikipedia.org/wiki/Remote_procedure_call)

  分布式系统的基础调用方式；gRPC、Thrift、Cap'n Proto 各自取舍。

## 代表项目

- [etcd](https://github.com/etcd-io/etcd) — Go 写的 Raft 实现，K8s 的存储后端
- [TiKV](https://github.com/tikv/tikv) — Rust 写的分布式 KV，TiDB 的引擎
- [CockroachDB](https://github.com/cockroachdb/cockroach) — Go 写的 NewSQL，Spanner 风格
- [Apache ZooKeeper](https://github.com/apache/zookeeper) — Java 老牌协调服务
- [TLA+ examples](https://github.com/tlaplus/Examples) — 共识算法的形式化规范

## 资料

- [Distributed Systems for Fun and Profit](http://book.mixu.net/distsys/)
- [Designing Data-Intensive Applications](https://dataintensive.net/) — 一本书学一半分布式
- [Jepsen 报告](https://jepsen.io/analyses) — 真实数据库的一致性测试，工程视角的最佳读物
- [MIT 6.824 课程](https://pdos.csail.mit.edu/6.824/) — 带 lab 的分布式系统课，自己写一遍 Raft
- [Google Spanner 论文](https://research.google/pubs/spanner-googles-globally-distributed-database-2/)
