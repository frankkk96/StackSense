---
title: "Data Infra"
order: 5
slug: "data-infra"
---

数据基础设施关注数据从写入到查询全链路的工程问题：存储引擎如何权衡读写放大，列式格式如何让分析查询更快，流处理如何在乱序和故障下给出正确答案，湖仓表格式如何在对象存储上提供事务语义。掌握这一层，才能读懂现代 OLAP、实时数仓和 Lakehouse 的设计取舍。

## 学完后你应该能回答

###  存储引擎（LSM / B+ Tree） 

  1. LSM-Tree 为什么写入快但读可能变慢？compaction 究竟在解决什么问题，它又引入了什么新的放大？
  2. 同样是索引结构，B+ Tree 和 LSM-Tree 在写放大、读放大、空间放大上各自的典型表现是什么？什么场景该选哪个？
  3. RocksDB 的 leveled / universal / FIFO compaction 各适合什么写入模式？三种放大怎么权衡？
  4. LSM 默认会配 bloom filter 的理由？什么情况下 bloom filter 反而拖慢读？
  5. RocksDB 的 LSM compaction 会放大写入，为什么它还能在 SSD 上跑得比 B-Tree 快？compaction_job.cc 里哪一段最能说明问题？
  6. Redis 为什么选择单线程 + IO 多路复用而不是多线程？ae.c 和 networking.c 里怎么做延迟 / 吞吐权衡？
  7. Redis cluster 的 hash slot 和一致性哈希相比，为什么选了定长 16384 slots？
  8. 近年出现的 FoundationDB / TigerBeetle 这类"确定性仿真"数据库，它们的存储引擎和 RocksDB 有何根本不同？

###  列存 & 查询执行 

  1. Parquet 为什么要按 row group + column chunk + page 三级切分？Dictionary encoding 和 RLE 分别在什么数据分布下有效？
  2. Dremel 的 repetition level 和 definition level 解决了嵌套结构列存中的什么问题？为什么不能直接展开成扁平列？
  3. 向量化执行相比火山模型快在哪里？为什么 ClickHouse 能比 Spark SQL 快一个数量级？
  4. ORC 和 Parquet 在 footer / stripe / bloom filter 上的差异？为什么 Hive 倾向 ORC 而 Spark 生态倾向 Parquet？
  5. Arrow 作为内存列存，零拷贝传递相比 Parquet 解决了什么问题？Flight 协议在其中起什么作用？
  6. ClickHouse 的 MergeTree 是什么层次的"LSM"？primary index、skip index、part 三级结构各自的角色？

###  流处理（Kafka / Flink） 

  1. Kafka 的 exactly-once 是怎么实现的？idempotent producer、事务、consumer 的 read_committed 各自负责哪一环？
  2. Flink Watermark 本质是什么？late event 出现时 window 的行为取决于哪几个旋钮（allowedLateness / sideOutput / trigger）？
  3. Kafka 的 ISR、leader 选举、unclean leader election 对一致性分别意味着什么？
  4. Kafka tiered storage 把冷数据放到 S3 之后，新的元数据和延迟问题怎么解？
  5. Flink aligned checkpoint vs unaligned checkpoint 分别解决什么问题？代价是什么？
  6. event time 和 processing time 混用会产生什么坑？迟到数据和补发如何设计？
  7. Flink 的 state backend（memory / rocksdb）在 checkpoint 大小和 recovery 时间上的权衡？

###  Lakehouse / 事务 

  1. Iceberg 和 Delta Lake 是怎么在 S3 这种只有 PUT 的对象存储上做出事务的？snapshot、manifest、commit conflict 解决分别是怎么做的？
  2. 湖仓在 S3 上的"事务"到底是什么？Iceberg / Delta / Hudi 解决 commit 冲突的机制差别？
  3. Iceberg 的 metadata JSON + manifest list + manifest 三层结构怎么支持 time travel 和 partition evolution？
  4. Hudi 的 CoW vs MoR 表各适合什么读写比？和 Iceberg 的 MoR 在 merge 策略上有什么不同？

###  MVCC / Schema 演进 / CDC 

  1. MVCC 下一次事务看到的快照是怎么确定的？vacuum / GC 为什么是 MVCC 系统逃不开的代价？
  2. CDC（Debezium 等）为什么要解 binlog / WAL？上游 schema 变更时下游怎么不崩？
  3. Avro / Protobuf / JSON 在 schema evolution（加字段、删字段、改类型）上的兼容性规则？
  4. Debezium 的 snapshot + incremental 模式和 "log-only" 模式各适合什么场景？
  5. dbt 这类"SQL 做 ETL"工具的核心价值在哪？和传统 Airflow + 手写 SQL 相比测试和 lineage 怎么做？

## 核心概念

- [LSM-Tree](https://www.cs.umb.edu/~poneil/lsmtree.pdf)

  为写优化的分层存储结构，原始论文。理解 memtable / SSTable / compaction 的分层思路是所有现代 KV（RocksDB、Cassandra、ScyllaDB）的共同前提。

- [B+ Tree](https://en.wikipedia.org/wiki/B%2B_tree)

  传统关系数据库的默认索引结构。和 LSM 对比着读，才能理解为什么 OLTP 和 KV 系统做了不同的工程取舍。

- [Parquet 列存](https://parquet.apache.org/docs/file-format/)

  分析场景的事实标准列式文件格式。读懂它的 row group / page / encoding，才能理解为什么 OLAP 扫描能比行存快一个数量级。

- [Dremel / 嵌套列存](https://research.google/pubs/dremel-interactive-analysis-of-web-scale-datasets-2/)

  Parquet / BigQuery 嵌套列存的思想源头。repetition / definition level 是处理 JSON-like 嵌套结构的关键。

- [MVCC](https://en.wikipedia.org/wiki/Multiversion_concurrency_control)

  Postgres、MySQL InnoDB、几乎所有现代 OLTP 都靠它实现读写不阻塞。理解快照和可见性规则是读源码的基础。

- [Kafka 日志存储](https://kafka.apache.org/documentation/#log)

  append-only log + segment + index 的经典实现。是流处理、CDC、事件溯源架构的共同底座。

- [Flink Watermark](https://nightlies.apache.org/flink/flink-docs-stable/docs/concepts/time/)

  流处理中处理乱序事件的核心机制。不理解 watermark 就没法谈 event time 窗口和 late data。

- [Exactly-once](https://www.confluent.io/blog/exactly-once-semantics-are-possible-heres-how-apache-kafka-does-it/)

  分布式流处理最被误解的概念之一。读完这篇能把 idempotent producer、transaction、consumer isolation 串起来。

- [Iceberg 表格式](https://iceberg.apache.org/spec/)

  开放 Lakehouse 的事实标准之一。snapshot / manifest / metadata 的设计决定了它怎么在对象存储上做 schema evolution 和 time travel。

- [Delta Lake](https://github.com/delta-io/delta/blob/master/PROTOCOL.md)

  Databricks 推的另一套 Lakehouse 协议。和 Iceberg 对比读，会看到事务日志设计的不同取舍。

## Lab

- [CMU 15-445 BusTub](https://15445.courses.cs.cmu.edu/)

  从 buffer pool 写到 B+ Tree 再到事务，是系统性入门数据库内核最好的开源课。

- [手写 mini-LSM KV](https://github.com/skyzh/mini-lsm)

  用 Rust 一步步实现 memtable、SSTable、compaction。比读论文更能让你摸清 LSM 的细节。

- [实现 Bloom Filter](https://en.wikipedia.org/wiki/Bloom_filter)

  几十行代码但在 LSM、数据库、缓存中无处不在。亲手写一遍能理解哈希函数数量和误判率的关系。

- [Kafka Producer/Consumer](https://kafka.apache.org/quickstart)

  官方 quickstart 跑一遍，把 topic / partition / offset 的心智模型建立起来，再谈流处理才不虚。

- [Flink WordCount](https://nightlies.apache.org/flink/flink-docs-stable/docs/try-flink/datastream/)

  最小可跑的 DataStream 例子。用它体会 keyBy、window、watermark 的基本 API。

- [DuckDB 查询实验](https://duckdb.org/docs/)

  嵌入式 OLAP，本机就能对 Parquet 做向量化查询。拿真实数据集跑 EXPLAIN 看执行计划特别直观。

- [读 Redis 源码](https://github.com/redis/redis)

  从 ae.c、networking.c、t_string.c 入手，体会单线程事件循环和 SDS / ziplist 的内存打包技巧。

- [读 LevelDB / RocksDB](https://github.com/facebook/rocksdb)

  LSM-tree 的工业参考实现。先读 LevelDB 把脉络摸清，再跳到 RocksDB 看 compaction、prefix bloom 这些真实场景扩展。

- [读 ClickHouse](https://github.com/ClickHouse/ClickHouse)

  列存 + SIMD + 向量化执行引擎的教科书。看 AggregatingTransform 和 ColumnVector 的内循环。

## 资料

- [Dremel 论文](https://research.google/pubs/dremel-interactive-analysis-of-web-scale-datasets-2/)

  嵌套列存和交互式 SQL 引擎的鼻祖论文，BigQuery 的底层思想。

- [Kudu 论文](https://storage.googleapis.com/pub-tools-public-publication-data/pdf/43841.pdf)

  HTAP 列存的一次重要尝试，讲清了为什么 OLAP 列存很难同时支持低延迟随机写。

- [C-Store 列存](https://www.vldb.org/conf/2005/papers/p553-stonebraker.pdf)

  列存 OLAP 的开山论文，Vertica 的前身。projection、压缩、排序列的思路至今仍在用。

- [Kafka 论文](https://notes.stephenholiday.com/Kafka.pdf)

  2011 年的原始设计论文。短小但把 log-centric 架构的取舍讲得很清楚。

- [Spanner 论文](https://research.google/pubs/spanner-googles-globally-distributed-database-2/)

  TrueTime + 全球一致性事务的标杆。理解它对后续 CockroachDB、YugabyteDB 的设计有直接帮助。

- [DDIA](https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/)

  Kleppmann 的《Designing Data-Intensive Applications》，数据系统领域最被推荐的一本综述书。

## 工具

- [DuckDB](https://duckdb.org/)

  单机向量化 OLAP 引擎。本地分析 Parquet / CSV 非常顺手，也是研究列存执行的好靶子。

- [ClickHouse](https://clickhouse.com/)

  生产级列存 OLAP 数据库，查询速度是业界标杆。读它的 MergeTree 源码能学到大量工程技巧。

- [RocksDB](https://github.com/facebook/rocksdb)

  工业界最广泛使用的 LSM KV 引擎，被 MySQL、TiDB、CockroachDB、Kafka Streams 等内嵌。

- [Kafka CLI](https://kafka.apache.org/documentation/#quickstart)

  kafka-console-producer / consumer / topics 这些命令行工具是排查消息系统的第一手武器。

- [Spark](https://spark.apache.org/)

  批处理事实标准，也是 Lakehouse 生态的主要计算引擎。理解 Catalyst / Tungsten 能让你懂现代 SQL 优化器。

- [Flink](https://flink.apache.org/)

  流处理事实标准，state、checkpoint、exactly-once 的工业实现参考。

