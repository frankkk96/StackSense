---
title: "必读经典课程"
order: 11
slug: "courses"
---

比起书，公开课的优势是有 PA / lab，逼你动手写而不是只读。下面是这一行——尤其是 systems / parallel / data / AI infra / CUDA 这些方向——口碑最稳的几门，几乎全部带录像、讲义、作业公开。挑一两门跟到底，比啃十本书都管用。

## 系统与性能

- [CMU 15-213 — Intro to Computer Systems](https://www.cs.cmu.edu/~213/)

  CSAPP 配套课，9 个 lab 从 bit puzzle 一路写到 proxy。系统方向打地基的那一门。

- [MIT 6.1810 — Operating Systems Engineering](https://pdos.csail.mit.edu/6.1810/)

  原 6.S081，基于 xv6 改 page table / scheduler / 文件系统 / mmap。读懂 Linux 之前先把它过一遍。

- [MIT 6.172 — Performance Engineering of Software Systems](https://ocw.mit.edu/courses/6-172-performance-engineering-of-software-systems-fall-2018/)

  Leiserson 的工业级性能工程课。优化矩阵乘法 / 排序 / cache，从 naive 干到接近 BLAS。

## 并行 / 分布式

- [CMU 15-418/618 — Parallel Computer Architecture and Programming](https://www.cs.cmu.edu/~418/)

  Kayvon Fatahalian 的并行计算课，行业里口碑最响的那门。GPU SIMT / 内存一致性 / 同步原语 + ISPC、CUDA、MPI 作业。

- [Stanford CS149 — Parallel Computing](https://gfxcourses.stanford.edu/cs149/)

  Kayvon 在 Stanford 的版本，和 15-418 同源但材料更新。lab 直接写多核 / GPU / 分布式实现。

- [MIT 6.5840 — Distributed Systems](https://pdos.csail.mit.edu/6.5840/)

  原 6.824，Robert Morris 主讲。4 个 lab 用 Go 实现 MapReduce → Raft → KV → Sharded KV。分布式课的金标准。

- [UC Berkeley CS267 — Applications of Parallel Computers](https://sites.google.com/lbl.gov/cs267-spr2024/)

  Jim Demmel 的 HPC 视角并行课，矩阵 / 图算法 / MPI / OpenMP。学院派 HPC 入坑首选。

## GPU / CUDA

- [UIUC ECE408 / CS483 — Applied Parallel Programming](https://lumetta.web.engr.illinois.edu/408-S20/)

  Wen-mei Hwu（PMPP 教材作者）的配套课，CUDA 入门首选。

- [GPU MODE Lectures](https://github.com/gpu-mode/lectures)

  业界一线工程师做的 GPU kernel 讲座系列，YouTube + GitHub 全公开，覆盖 CUDA / Triton / FlashAttention 实战。

- [NVIDIA Deep Learning Institute](https://www.nvidia.com/en-us/training/)

  官方 CUDA / Nsight / cuDNN 系列短课，部分免费。

- [CUDA Training Series (OLCF)](https://www.olcf.ornl.gov/cuda-training-series/)

  橡树岭国家实验室的 CUDA 系列讲座，从 hello world 到多 GPU。视频 + slides 公开。

## 数据库

- [CMU 15-445/645 — Database Systems](https://15445.courses.cs.cmu.edu/)

  Andy Pavlo 的数据库入门课。BusTub C++ 项目，从 buffer pool 一路写到 query executor。

- [CMU 15-721 — Advanced Database Systems](https://15721.courses.cs.cmu.edu/)

  Pavlo 的进阶版，每年聚焦不同方向（OLAP / vectorized / cloud DB）。讲座 + 论文导读。

- [Berkeley CS186 — Introduction to Database Systems](https://cs186berkeley.net/)

  Berkeley 的本科 DB 课，作业是写 RookieDB（Java），和 15-445 互补。

## AI / ML 系统

- [CMU 10-714 — Deep Learning Systems](https://dlsyscourse.org/)

  Tianqi Chen + J. Zico Kolter 主讲。从零写一个 PyTorch (needle)，autograd / GPU / Transformer 全栈。AI infra 必修。

- [Stanford CS336 — Language Modeling from Scratch](https://stanford-cs336.github.io/spring2024/)

  Percy Liang，从零实现 GPT/Llama 级 LLM，覆盖 tokenization、训练、scaling、评估。2024 年最火的 LLM 课。

- [MIT 6.5940 — TinyML and Efficient Deep Learning Computing](https://hanlab.mit.edu/courses/2024-fall-65940)

  Song Han 主讲。量化 / 剪枝 / 蒸馏 / 编译 / 端侧推理，工业 AI infra 视角。

- [Stanford CS229 — Machine Learning](https://cs229.stanford.edu/)

  Andrew Ng 的经典 ML 课，理论基础底座。

- [Stanford CS231N — CNN for Visual Recognition](http://cs231n.stanford.edu/)

  深度学习视觉课的标杆，作业从零实现 backprop / conv / RNN。仍是 DL 入门首选。

- [Full Stack Deep Learning](https://fullstackdeeplearning.com/)

  Pieter Abbeel 团队的 ML 工程实战课，覆盖从 data 到 deploy 的工程闭环。

## 网络 / 编译器

- [Stanford CS144 — Introduction to Computer Networking](https://cs144.github.io/)

  著名 lab：用 C++ 从零实现一个 TCP。把 RFC 那堆术语变成跑得通的代码。

- [MIT 6.829 — Computer Networks](https://web.mit.edu/6.829/www/currentsemester/)

  研究生网络课，论文导读式，覆盖现代网络系统设计。

- [Stanford CS143 — Compilers](https://web.stanford.edu/class/cs143/)

  Alex Aiken 主讲，COOL 语言项目，编译原理标杆课。Coursera 也有版本。

