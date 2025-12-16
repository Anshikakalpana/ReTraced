job-scheduler/
├── docker-compose.yml
├── api/
├── worker/
└── README.md




api/
├── Dockerfile -
├── package.json -
├── tsconfig.json -
├── .env -
├── dist/ -
└── src/
    ├── index.ts        -         # API bootstrap (server start)
    │
    ├── routes/
    │   ├── health.routes.ts    # /health
    │   ├── job.routes.ts       # create job, list jobs
    │   └── dlq.routes.ts       # view / retry dead jobs

    ├── job/
    │   ├── job.ts  -            # job data model & interface
    │   ├── job.service.ts   ?   # add job to queue
    │   ├── job.retry.ts        # retry config (max retries etc.)
    │   └── job.dlq.ts          # DLQ helper (requeue, inspect)
    │
    ├── utils/
    │   ├── redis.ts  -          # Redis client
    │   ├── postgres.ts          # DB connection
    │   └── logger.ts            # centralized logging
    │
    └── config/
        ├── redis.config.ts     # redis constants
        ├── queue.config.ts     # queue names, retry limits
        └── env.ts              # env validation




worker/
├── Dockerfile-
├── package.json-
├── tsconfig.json-
├── .env -
├── dist/   -
└── src/
    ├── index.ts               # Worker bootstrap
    ├── worker.ts          -    # Main consume loop
    │
    ├── handlers/
    │   ├── email.handler.ts   # example job handler
    │   ├── report.handler.ts
    │   └── index.ts           # handler registry
    │
    ├── retry/
    │   ├── retry.strategy.ts  # retry decision logic
    │   └── backoff.ts         # exponential backoff
    │
    ├── dlq/
    │   ├── dlq.producer.ts    # push job to DLQ
    │   ├── dlq.types.ts       # DLQ job structure
    │   └── dlq.metrics.ts     # DLQ counters
│
    ├── queue/
    │   ├── consumer.ts        # pop job from Redis
    │   ├── ack.ts             # success acknowledgement
    │   └── delay.ts           # delayed job logic
    │
    ├── utils/
    │   ├── redis.ts  -         # Redis client
    │   ├── postgres.ts        # optional DB logging
    │   └── logger.ts
    │
    └── config/
        ├── worker.config.ts   # concurrency, polling
        ├── retry.config.ts    # retry limits
        └── queue.config.ts




Redis
├── job_queue              # main queue
├── retry_queue            # delayed retries
└── dead_letter_queue      # poison jobs





job.service.ts
├── createJob()
├── fetchNextJob()
├── markJobProcessing()
├── markJobCompleted()
├── markJobFailed()
├── moveToDeadQueue()
├── retryJob()
├── getJobStatus()
├── getMetrics()
