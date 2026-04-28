---
title: "工程与可观测"
order: 8
slug: "engineering"
---

写完代码只是上半场，让它在生产环境稳定跑才是下半场：容器、K8s、Prometheus、OpenTelemetry、SLO。这个模块的目标是让你能独立把一个服务部署到集群、能定义合理的 SLI / SLO、能在凌晨三点根据四个黄金信号和调用链定位到出问题的那一行代码。

## 学完后你应该能回答

###  容器 / K8s 基础 

  1. 镜像里的一层和容器运行时的可写层分别存在哪里？为什么 `docker commit` 出的镜像通常比 Dockerfile 构建的大？
  2. Pod 的 requests 和 limits 分别影响调度器的什么决策？设 limit 不设 request 会怎样？反过来呢？
  3. 同一个 Service 后面 10 个 Pod，kube-proxy iptables 模式和 IPVS 模式在连接分布上有什么区别？
  4. Deployment 的滚动更新在什么情况下会卡住？kubectl rollout status 看到 stuck，你会依次检查哪些资源？
  5. Helm values 覆盖优先级是怎样的？chart 里 `{{- if .Values.x -}}` 的 `-` 去掉会怎样？
  6. Init container、sidecar、ephemeral container 各适合什么场景？在 Pod 生命周期里分别什么时候起来？

###  K8s 高级模式 

  1. kube-scheduler 的 plugin 化架构（filter / score）怎么扩展？自定义调度器的典型落地路径是什么？
  2. Pod 的 priority / preemption 机制怎么工作？大规模集群里经常踩什么坑？
  3. StatefulSet 和 Deployment 的核心差异在哪？为什么有状态服务一般还要配套 Operator？
  4. Operator 模式的 reconcile loop 怎么写才幂等？level-triggered vs edge-triggered 的取舍？
  5. CRD + admission webhook 的典型扩展路径？mutating 和 validating 两类 webhook 各在哪个阶段介入？

###  发布 & GitOps 

  1. GitOps（ArgoCD / Flux）怎么处理"集群和 Git 发散"？auto-sync 和 manual sync 分别适合什么团队？
  2. 金丝雀、蓝绿、滚动发布的差异？Istio 做流量切分相比 Service + Deployment 多出什么能力？
  3. Progressive delivery（Flagger / Argo Rollouts）里 metric-driven rollback 的闭环是怎么跑的？
  4. 多集群、多区域部署时 ArgoCD ApplicationSet 和 Flux Kustomization 各自的工程模型差异？

###  SLO / 错误预算 

  1. 你要给一个延迟敏感的 API 定义 SLO，选 p99 还是 p999？错误预算（error budget）用完后团队应该做什么？
  2. 四个黄金信号（latency / traffic / errors / saturation）对应到 Prometheus，你会用哪些 metric 类型（counter / gauge / histogram）去表达？
  3. Multi-window multi-burn-rate SLO 告警是怎么组合的？为什么单 burn rate 会出现假警报？
  4. Error budget 用完后"冻结功能开发"在工程文化上怎么落地？什么情况下可以例外？
  5. histogram_quantile 在 Prometheus 里什么时候会骗你？和 summary 各适合什么场景？

###  Observability / Tracing 

  1. OpenTelemetry 里 trace、metric、log 的 context 是怎么关联的？看到一条错误日志，如何跳到对应的 trace？
  2. OpenTelemetry Collector 的 receiver / processor / exporter 管道，典型生产部署长什么样？
  3. 分布式追踪的采样策略（head-based vs tail-based）如何选？尾采样的工程复杂度主要在哪？
  4. 日志走 Loki、追踪走 Tempo、指标走 Prometheus，在"一个 trace id 跳到日志和指标"时用的是哪些 label / attribute 约定？
  5. Continuous profiling（pprof / Parca / Pyroscope）作为第四根支柱，和传统 metric/log/trace 互补在哪？

## 核心概念

- [容器与镜像](https://docs.docker.com/get-started/overview/)

  基于 namespace + cgroup 的进程隔离，镜像是只读层的堆叠。先搞清楚容器不是虚拟机。

- [K8s 调度](https://kubernetes.io/docs/concepts/scheduling-eviction/)

  scheduler 根据 node 资源、亲和性、taint / toleration 把 Pod 绑到 Node。面试和排障绕不开。

- [资源请求与限制](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/)

  requests 决定调度和 QoS 级别，limits 决定 cgroup 上限。OOMKilled 多半是这里配错。

- [Service / Ingress](https://kubernetes.io/docs/concepts/services-networking/service/)

  Service 提供集群内稳定 VIP 和负载均衡，Ingress 处理 L7 入口。理解 kube-proxy 才能排网络问题。

- [Trace / Metric / Log](https://opentelemetry.io/docs/concepts/signals/)

  可观测性三支柱。Metric 回答「有没有事」，Log 回答「是什么事」，Trace 回答「在哪一环出的事」。

- [SLI / SLO / SLA](https://sre.google/sre-book/service-level-objectives/)

  指标、目标、合约三层。错误预算是工程和产品平衡速度与稳定性的共同语言。

- [发布与回滚](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)

  Deployment 提供滚动更新和回滚。配合 readinessProbe、PDB 才是真·安全发布。

- [四个黄金信号](https://sre.google/sre-book/monitoring-distributed-systems/)

  Latency / Traffic / Errors / Saturation。任何服务的监控面板都该从这四个开始。

## Lab

- [K8s 部署玩具服务](https://kubernetes.io/docs/tutorials/kubernetes-basics/)

  从零写 Deployment + Service + Ingress，本地用 kind 或 minikube 跑通。

- [本地 Prometheus + Grafana](https://prometheus.io/docs/tutorials/getting_started/)

  给玩具服务加 /metrics，写第一个 PromQL 告警规则，做一个 latency + QPS 的 Grafana 面板。

- [接入 OpenTelemetry](https://opentelemetry.io/docs/getting-started/dev/)

  在服务里埋点 trace 和 metric，用 OTLP 导到 collector。体会 propagation 和 context 传递。

- [Helm chart 打包](https://helm.sh/docs/chart_template_guide/getting_started/)

  把手写 yaml 改成 Helm chart，理解 values、template、release 三层模型。

- [Jaeger 追踪调用链](https://www.jaegertracing.io/docs/latest/getting-started/)

  部署一个多服务 demo，在 Jaeger UI 里看到跨服务的 trace tree，学会定位慢 span。

## 资料

- [Kubernetes Patterns](https://k8spatterns.io/)

  把 K8s 里反复出现的设计抽成模式，例如 Sidecar、Ambassador、Init Container。

- [SRE Book](https://sre.google/sre-book/table-of-contents/)

  Google SRE 的方法论底座。SLO、错误预算、on-call、post-mortem 都出自这里。

- [K8s 官方文档](https://kubernetes.io/docs/home/)

  质量相当高的官方文档。Concepts 章节至少通读一遍。

- [Prometheus 文档](https://prometheus.io/docs/introduction/overview/)

  数据模型、PromQL、recording rule、alertmanager。做监控前先把这套模型吃透。

- [OpenTelemetry 文档](https://opentelemetry.io/docs/)

  trace / metric / log 的统一标准。API、SDK、Collector 分层要分清楚。

## 工具

- [kubectl](https://kubernetes.io/docs/reference/kubectl/)

  K8s 的瑞士军刀。describe、logs、exec、port-forward、debug 是每天都要用的五个子命令。

- [Helm](https://helm.sh/)

  K8s 的包管理器。生产里极少有人手写裸 yaml 部署。

- [Prometheus](https://prometheus.io/)

  事实标准的指标系统。Pull 模型 + 标签 + PromQL 的组合是整个云原生监控的地基。

- [Grafana](https://grafana.com/oss/grafana/)

  仪表盘和告警前端。不只用于 Prometheus，还能聚合 Loki、Tempo、各种 DB。

- [OpenTelemetry](https://opentelemetry.io/)

  厂商中立的观测数据标准。SDK 埋点 + Collector 转发是目前最推荐的埋点方式。

- [Jaeger](https://www.jaegertracing.io/)

  开源分布式追踪后端。看 trace tree 定位跨服务慢调用的主力工具。

