---
title: "数据工程"
order: 2
slug: "data-engineering"
---

数据系统这一层处理"数据从落盘到查询"的整条路径：列式存储格式怎么省空间又跑得快、表格式怎么支持 ACID 和时间旅行、计算引擎怎么把 SQL 编译成分布式执行计划、流处理怎么保证 exactly-once、元数据服务怎么在多个引擎之间共享。每一层的取舍都决定了上游能问出什么样的查询，下游能拿到多新鲜的数据。

## 学完后你应该能回答

  1. Parquet 的 row group / column chunk / page 三层结构分别在干什么？为什么列式比行式适合分析查询？
  2. Iceberg / Delta / Hudi 三种表格式怎么解决"在对象存储上做 ACID"？它们对小文件、并发写、schema evolution 的处理差在哪？
  3. Spark 的 Catalyst 优化器和 Tungsten 执行引擎各自负责什么？为什么 RDD → DataFrame 不是简单的 API 升级？
  4. Flink 的 checkpoint barrier 算法怎么做到 exactly-once？跟 Spark Structured Streaming 的微批模型差在哪？
  5. Kafka 的 log compaction 适用场景？consumer group rebalance 为什么是流处理工程师的噩梦？
  6. ClickHouse 的 MergeTree 怎么做到列式 + 实时写入？跟 DuckDB 的 OLAP 设计哲学差在哪？
  7. 数据湖仓 = 对象存储 + 表格式 + 计算引擎，这套组合相比传统 MPP 数据库的取舍是什么？

## 核心概念

- [Parquet](https://parquet.apache.org/)

  列式存储事实标准。理解 row group、column chunk、page、字典编码、RLE，是读所有数据系统源码的入门券。

- [ORC](https://orc.apache.org/)

  Hive 系的列式格式，Parquet 的另一种选择。stripe + index + footer 结构。

- [Apache Iceberg](https://iceberg.apache.org/)

  Netflix 起源的现代表格式：metadata 树 + manifest 文件，避免了 Hive 风格的 listing 灾难。

- [Delta Lake](https://delta.io/)

  Databricks 主导的表格式，靠事务日志做 ACID。

- [Apache Hudi](https://hudi.apache.org/)

  Uber 起源；CoW 和 MoR 两种表类型分别针对查询和写入优化。

- [Apache Spark](https://spark.apache.org/)

  最广泛使用的分布式计算引擎；Catalyst 优化器 + Tungsten 执行 + Spark SQL。

- [Apache Flink](https://flink.apache.org/)

  流处理标杆：state + checkpoint + watermark + exactly-once。

- [Apache Kafka](https://kafka.apache.org/)

  分布式 log，事实上的 streaming 总线；理解它的存储模型对所有 streaming 设计都有帮助。

- [Trino / Presto](https://trino.io/)

  联邦查询引擎，把 SQL 推到 Parquet / Iceberg / 数据库。

- [ClickHouse](https://clickhouse.com/)

  MergeTree + 列式 + 向量化执行，是 OLAP 的现代代表。

- [DuckDB](https://duckdb.org/)

  本地的 OLAP 数据库，正在替代 pandas 处理中等规模数据。

- [PostgreSQL](https://www.postgresql.org/)

  OLTP 领域最强的开源数据库，wal、MVCC、查询优化器都值得读源码。

## 代表项目

- [Apache Spark](https://github.com/apache/spark)
- [Apache Flink](https://github.com/apache/flink)
- [Apache Iceberg](https://github.com/apache/iceberg)
- [ClickHouse](https://github.com/ClickHouse/ClickHouse)
- [DuckDB](https://github.com/duckdb/duckdb)
- [PostgreSQL](https://github.com/postgres/postgres)

## 资料

- [Designing Data-Intensive Applications](https://dataintensive.net/) — Kleppmann，这一层的事实教科书
- [Database Internals](https://www.databass.dev/) — 存储引擎和分布式系统的内部
- [The Log: What every software engineer should know](https://engineering.linkedin.com/distributed-systems/log-what-every-software-engineer-should-know-about-real-time-datas-unifying)
- [Streaming Systems](https://www.oreilly.com/library/view/streaming-systems/9781491983867/) — Tyler Akidau，流处理理论
