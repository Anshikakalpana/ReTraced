import { Job, JobResult } from "../common/job.type.js";
import { JobErrorCode } from "../common/failures/jobErrorCodes.js";
import redis from "../utils/redis.js";
import { getQueueKeys } from "../common/queue.constants.js";
const queueName = 'email';
const queueKeys = getQueueKeys(queueName);
const TARGET_JOBS= 1000

export const enqueueJobs = async () => {
  for (let i = 0; i < TARGET_JOBS; i++) {
    const job: Job = {
      jobId: `job-${i}`,
      createdAt: Date.now(),
      queueName,
      status: 'pending',
      tries: 0,
      maxTries: 5,
      jobData: {
        emailFrom: 'noreply@test.com',
        emailTo: 'user@test.com',
        subject: 'Test',
        body: 'Hello'
      },
      backoffConfig: {
        baseDelaySeconds: 5,
        maxDelaySeconds: 60,
        factor: 2,
        limitOfTries: 5
      },
      backoffStrategy: 'exponential'
    };

    await redis.rPush(queueKeys.ready, JSON.stringify(job));
  }
};
