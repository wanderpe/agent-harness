---
name: empirical-system-design
description: Benchmark-driven, anti-over-engineering system design and scaling discipline (inspired by Arjay McCandless). Use when designing backend architecture, evaluating caching/replicas/sharding, or load-testing endpoints.
---

# Empirical System Design (Measure Before Scaling Out)

Default to the **simplest architecture that clears the measured workload**. Never pay distributed-systems complexity for hypothetical scale.

## 1. Back-of-the-Envelope Math First
Before proposing new infrastructure (Redis, Kafka, read replicas, sharding, microservices), state:
- **Throughput:** Expected requests/sec (average & peak) and read:write ratio.
- **Data Size:** Row count, payload size, growth rate over 12 months.
- **Bottleneck Hypothesis:** CPU, disk IOPS, DB connections, memory, or network?

## 2. Scale Up & Optimize Queries First
On equal hardware, a single bigger database box routinely outperforms multi-node replica/shard setups due to zero coordination overhead, zero replica lag, and simpler queries. Exhaust these in order first:
1. **Fix the query:** Run `EXPLAIN ANALYZE`, add missing composite/covering indexes, eliminate N+1 queries, bound pagination.
2. **Fix connections:** Add connection pooling (e.g., PgBouncer) and sane query/HTTP timeouts.
3. **Scale up vertically:** Bigger CPU / RAM / NVMe IOPS on one node before splitting into multiple nodes.

## 3. Scale Out Only at a Measured Ceiling
Introduce distributed components ONLY when you hit a concrete ceiling:
- **Read Replicas / Cache (Redis):** Only when read load saturates primary CPU/IOPS *after* indexing, and stale reads are acceptable for that endpoint.
- **Sharding:** Only when single-node disk IOPS, write throughput, or storage ceiling is actually breached (or blast-radius isolation is a hard SLA).
- **Async Queues:** Only for slow/unreliable work (emails, webhooks, exports, third-party APIs) that shouldn't block HTTP responses.

## 4. Load-Test as an Outside Judge
Never claim an endpoint "scales" by staring at code. For performance-critical paths, run a quick load test (`k6`, `autocannon`, or `wrk`) against a realistic dataset and record p50/p95/p99 latency, throughput (RPS), and error rate before and after optimization.
