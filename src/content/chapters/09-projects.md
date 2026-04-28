---
title: "必读开源项目"
order: 9
slug: "projects"
---

前八章讲的都是概念、Lab 和工具链；最后留一份清单：分布式系统、Data、AI、CUDA 这四个方向里最值得读源码的项目。挑一两个你最想理解的方向，先读 README 和 design doc，再钻进 src 看核心数据结构和热路径——读工业级源码比看博客密度高一个数量级。这里只列代表作，不求全。

## 分布式系统

- [etcd](https://github.com/etcd-io/etcd)

  Raft + KV，K8s 控制面的依赖。学 Raft 工程化实现的最佳样本，Go 写的，代码量适中。

- [TiKV](https://github.com/tikv/tikv)

  分布式事务 KV，Multi-Raft + Percolator。Rust 写的工业级共识 + 事务工程参考。

- [CockroachDB](https://github.com/cockroachdb/cockroach)

  分布式 SQL，serializable 隔离 + HLC 时钟。Go 写的开源 NewSQL 代表作。

- [FoundationDB](https://github.com/apple/foundationdb)

  苹果的分布式 KV，确定性模拟测试是其工程亮点。读 simulation framework 比读引擎本身更值。

- [YugabyteDB](https://github.com/yugabyte/yugabyte-db)

  兼容 Postgres / Cassandra 的分布式 SQL，C++ 实现。

- [ScyllaDB](https://github.com/scylladb/scylladb)

  C++ 重写的 Cassandra，shard-per-core + Seastar 框架，性能工程的范本。

- [Apache Cassandra](https://github.com/apache/cassandra)

  Dynamo 模型的 wide-column 数据库，最终一致性派的代表。

- [ZooKeeper](https://github.com/apache/zookeeper)

  ZAB 协议，老一代分布式协调服务。Kafka / HBase 老版本依赖它。

- [Consul](https://github.com/hashicorp/consul)

  HashiCorp 的服务发现 + KV，多数据中心首选。Go 写的 Raft 实现也很值得读。

- [Nomad](https://github.com/hashicorp/nomad)

  简洁的调度器，K8s 之外另一种思路。代码量比 K8s 小一个数量级，适合通读。

## Data

### 存储引擎

- [RocksDB](https://github.com/facebook/rocksdb)

  LSM-tree 工业标准。TiKV、CockroachDB、Kafka Streams、Flink 状态后端都内嵌或参考它。

- [LevelDB](https://github.com/google/leveldb)

  Google 的 LSM 原型，比 RocksDB 干净。读源码入门 LSM 的首选。

### 消息 / 流

- [Apache Kafka](https://github.com/apache/kafka)

  分布式日志事实标准，分区 + ISR 副本协议是必读。

- [Apache Pulsar](https://github.com/apache/pulsar)

  计算 / 存储分离的下一代消息系统，BookKeeper 提供日志层。

- [Redpanda](https://github.com/redpanda-data/redpanda)

  C++ 重写的 Kafka 兼容系统，Seastar + thread-per-core 架构。

- [NATS](https://github.com/nats-io/nats-server)

  极简云原生消息队列，Go 写得很优雅。

### OLAP / 查询引擎

- [ClickHouse](https://github.com/ClickHouse/ClickHouse)

  列存 OLAP 标杆，向量化执行 + 物化视图，C++ 性能工程教科书。

- [DuckDB](https://github.com/duckdb/duckdb)

  嵌入式 OLAP，"OLAP 界的 SQLite"。代码量小、工程优雅，适合通读。

- [StarRocks](https://github.com/StarRocks/starrocks)

  Doris fork，C++ 引擎重写，MPP OLAP 性能激进。

- [Apache Doris](https://github.com/apache/doris)

  MPP OLAP，国内开源代表。

- [Apache Druid](https://github.com/apache/druid)

  时序 / 实时 OLAP 老牌，分段存储 + 倒排索引。

- [Trino](https://github.com/trinodb/trino)

  Presto fork，联邦查询引擎事实标准。

- [Apache DataFusion](https://github.com/apache/datafusion)

  Rust + Arrow-native 查询引擎，现代 OLAP 引擎的"乐高积木"。

- [Velox](https://github.com/facebookincubator/velox)

  Meta 的 C++ 执行引擎，被 Presto / Spark 接入。

- [Apache Arrow](https://github.com/apache/arrow)

  列式内存格式 + 跨语言计算库，整个现代数据栈的内存层。

### Lakehouse / Table Format

- [Apache Iceberg](https://github.com/apache/iceberg)

  表格式标准，schema evolution、time travel、partition evolution。

- [Delta Lake](https://github.com/delta-io/delta)

  Databricks 的 ACID 表层，事务日志 + Parquet。

- [Apache Hudi](https://github.com/apache/hudi)

  增量数据湖，COW / MOR 两种存储模式。

### 计算

- [Apache Spark](https://github.com/apache/spark)

  大数据计算事实标准，RDD / DataFrame / Catalyst 三层值得分别读。

- [Apache Flink](https://github.com/apache/flink)

  流处理标杆，exactly-once、state backend、checkpoint 算法都是工业级参考。

- [Ray](https://github.com/ray-project/ray)

  分布式 Python 计算 + AI workload 编排，object store + scheduler 设计精彩。

### 编排

- [Apache Airflow](https://github.com/apache/airflow)

  DAG 调度老大哥，Python 写的工作流编排。

- [Dagster](https://github.com/dagster-io/dagster)

  以数据资产为中心的编排，类型系统 + asset graph 思路新颖。

- [Temporal](https://github.com/temporalio/temporal)

  持久化 workflow，event-sourcing + replay 模型，Cadence 的演进。

## AI

### 训练 / 框架

- [PyTorch](https://github.com/pytorch/pytorch)

  事实标准框架。autograd、ATen、Inductor、Distributed 各模块都有独立读法。

- [JAX](https://github.com/jax-ml/jax)

  函数式自动微分 + XLA，Google 系研究首选。pmap / pjit / shard_map 是分布式范式。

- [DeepSpeed](https://github.com/deepspeedai/DeepSpeed)

  微软的大模型训练优化，ZeRO 三个 stage 的实现是必读。

- [Megatron-LM](https://github.com/NVIDIA/Megatron-LM)

  NVIDIA 的张量并行 + 流水并行参考实现，大模型训练的工程模板。

- [TorchTitan](https://github.com/pytorch/torchtitan)

  PyTorch 原生 4D 并行参考实现，DTensor + FSDP2 的最简洁示例。

- [ColossalAI](https://github.com/hpcaitech/ColossalAI)

  潞晨开源的并行训练系统，覆盖各种并行策略。

### 推理 / 服务

- [vLLM](https://github.com/vllm-project/vllm)

  PagedAttention 发源地，LLM 推理事实标准。continuous batching + KV cache 设计必读。

- [SGLang](https://github.com/sgl-project/sglang)

  RadixAttention + 调度优化，结构化生成和 prefix sharing 的前沿。

- [TensorRT-LLM](https://github.com/NVIDIA/TensorRT-LLM)

  NVIDIA 的 LLM 推理 SDK，融合 kernel 和 in-flight batching 实现细节丰富。

- [llama.cpp](https://github.com/ggml-org/llama.cpp)

  C++ 端侧推理，量化 / GGML / CPU SIMD 优化的范本。

- [Triton Inference Server](https://github.com/triton-inference-server/server)

  NVIDIA 多框架推理服务，dynamic batching + ensemble 模型。

- [ONNX Runtime](https://github.com/microsoft/onnxruntime)

  微软的跨硬件推理运行时，graph optimization + execution provider 模式。

### 分布式 / 通信

- [NCCL](https://github.com/NVIDIA/nccl)

  NVIDIA 的 GPU 集体通信库，all-reduce / all-gather / NVLink 拓扑感知是地基。

- [Horovod](https://github.com/horovod/horovod)

  Uber 开源的 ring all-reduce 训练框架，分布式 SGD 的早期范本。

- [DeepEP](https://github.com/deepseek-ai/DeepEP)

  DeepSeek 的 MoE 通信库，Expert Parallel 的高性能 all-to-all 实现。

### 向量 / 检索

- [FAISS](https://github.com/facebookresearch/faiss)

  Meta 的向量索引库，IVF / HNSW / PQ 等算法的工业实现。

- [Milvus](https://github.com/milvus-io/milvus)

  工业级向量数据库，存算分离架构。

- [Qdrant](https://github.com/qdrant/qdrant)

  Rust 写的向量数据库，filter + ANN 联合优化。

## CUDA / GPU Kernel

- [CUTLASS](https://github.com/NVIDIA/cutlass)

  NVIDIA 官方 GEMM 模板库，CuTe 是其新一代抽象。写高性能 kernel 必读。

- [FlashAttention](https://github.com/Dao-AILab/flash-attention)

  Tri Dao 的注意力 kernel，I/O-aware 优化范本。Transformer 推理 / 训练都在用。

- [FlashInfer](https://github.com/flashinfer-ai/flashinfer)

  LLM 推理专用 attention kernel 库，paged KV / prefill / decode 各场景特化。

- [OpenAI Triton](https://github.com/triton-lang/triton)

  Python 写 GPU kernel 的 DSL，PyTorch Inductor 的后端，写自定义 kernel 的首选。

- [Apache TVM](https://github.com/apache/tvm)

  跨硬件深度学习编译器，IR + auto-scheduling。

- [MLIR](https://github.com/llvm/llvm-project/tree/main/mlir)

  多层中间表示，编译器界的统一基石。Triton / IREE / TensorFlow 都建在上面。

- [ThunderKittens](https://github.com/HazyResearch/ThunderKittens)

  Stanford 的 GPU kernel DSL，专攻 H100 / WGMMA，几百行写出 SOTA kernel。

- [cuCollections](https://github.com/NVIDIA/cuCollections)

  GPU 上的容器 / 数据结构库，hash map / multimap 等。

- [NVSHMEM](https://docs.nvidia.com/nvshmem/release-notes-install-guide/index.html)

  NVIDIA 的 PGAS 通信库，GPU 间直接 put/get，跳过 CPU。

