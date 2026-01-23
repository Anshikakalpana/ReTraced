# Distributed Job Scheduler
[![CI](https://github.com/Anshikakalpana/job-scheduler/.github/workflows/test.yml/badge.svg)](https://github.com/Anshikakalpana/job-scheduler/.github/workflows/test.yml)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg?style=flat-square)](https://github.com/Anshikakalpana/job-scheduler/graphs/commit-activity)

A **high-performance**, Dockerized **Distributed Job Scheduler** built with  
**Node.js, TypeScript, Redis, Docker**, implementing **API, Worker, Retry System & Dead Letter Queue (DLQ)**.

---

## 📑 Table of Contents

- [📑 Table of Contents](#-table-of-contents)
- [   Features](#-features)
- [   Future Additions](#-future-additions)
- [🛠 Tech Stack](#-tech-stack)
- [  Architecture Overview](#-architecture-overview)
- [✔ Retry Strategy - Three-Tier System](#-retry-strategy---three-tier-system)
- [✔ Visibility Timeout](#-visibility-timeout)
- [  API-WORKER-DLQ (Full Details)](#-api-worker-dlq-full-details)
  - [✔ Responsibilities](#-responsibilities)
  - [✔ How it Works](#-how-it-works)
  - [✔ Characteristics](#-characteristics)
- [🐳 Setup \& Installation](#-setup--installation)
- [🧪 Testing \& Load Scenarios](#-testing--load-scenarios)
- [🧭 Roadmap](#-roadmap)
- [📄 License](#-license)
- [🤝 Contributing](#-contributing)
- [⭐ Show Your Support](#-show-your-support)

---

##   Features

✔ Implements:

- Distributed job processing with Redis-backed queues  
- Three-tier retry mechanism: Immediate → Exponential Backoff → DLQ  
- Dead Letter Queue (DLQ) for permanent failures & manual recovery  
- Visibility timeout to prevent duplicate processing  
- Automatic stuck job recovery with watchdog (runs every 10s)  
- Job acknowledgement system (at-least-once delivery)  
- Exponential backoff with configurable max delay (default: 1 hour)  
- Dockerized architecture (API + Worker services)  
- TypeScript for end-to-end type safety  
- Configurable retry policies per job type  
- Atomic Redis operations using `BRPOPLPUSH`  
- Comprehensive Jest testing (unit + integration tests)  
- Multiple workers with concurrency control
  
---

##   Future Additions
  
- Lua scripts for fully atomic Redis operations  
- PostgreSQL fallback for persistence & job result storage  
- Prometheus / Grafana metrics  
- Distributed tracing (OpenTelemetry)  

---

## 🛠 Tech Stack

**Node.js • TypeScript • Express.js • Redis • Jest • Docker & Docker Compose**

---

##   Architecture Overview




---

## ✔ Retry Strategy - Three-Tier System

1️⃣ Immediate retry (short failures)  
2️⃣ Exponential backoff retry (transient issues)  
3️⃣ Dead Letter Queue (permanent failure)

---

## ✔ Visibility Timeout

- Worker moves job → `processing_queue`
- If worker crashes → watchdog requeues job
- Prevents job loss & duplicate execution

---

##   API-WORKER-DLQ (Full Details)

<details>
<summary>1️- API</summary>

The **API** is responsible for creating jobs and tracking their lifecycle.

### ✔ Responsibilities
- Accept job creation requests  
- Store job metadata  
- Push jobs to Redis queue  
- Expose job status & DLQ endpoints  

</details>

<details>
<summary>2️- WORKER</summary>

The **Worker** continuously consumes jobs from Redis.

### ✔ How it Works
- Fetch job using `BRPOPLPUSH`
- Mark job as processing
- Execute handler
- Acknowledge success or trigger retry

</details>

<details>
<summary>3️- Dead Letter Queue (DLQ)</summary>

Handles permanently failed jobs.

### ✔ Characteristics
- Stores poison jobs  
- Supports inspection & manual retry  
- Prevents infinite retry loops  

</details>

---

##   Setup & Installation

```bash
# Clone repository
git clone https://github.com/Anshikakalpana/job-scheduler


# Start services
docker compose up --build

#For testing 
docker compose exec worker dist/handlers/email.handler.js


```

**Starts:**
- Redis Cluster
- Node.js server


---

## 🧪 Testing & Load Scenarios

 cd worker 
npm run test

---

## 🧭 Roadmap

- Multiple worker instances
- Job prioritization
- Scheduled/cron Jobs  
- Rate limiting per job type 
- Job cancellation support
- Prometheus/Grafana dashboards  
- Distributed tracing (OpenTelemetry)  

---

## 📄 License

MIT License — free for personal & commercial use.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to check the [issues page](https://github.com/Anshikakalpana/job-scheduler/issues).

**Guidelines** 

1- Fork the repository
2- Create your feature branch (git checkout -b feature/amazing-feature)
3- Commit your changes (git commit -m 'Add some amazing feature')
4- Push to the branch (git push origin feature/amazing-feature)
5- Open a Pull Request


---

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

---


**Made with ❤️ by [Anshika Kalpana](https://github.com/Anshikakalpana)**

