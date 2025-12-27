// import redis from "../utils/redis.js";
// import { job, JobResult ,delay } from "../common/job.type.js";
// import { getQueueKeys } from "../common/queue.constants.js";
// import { moveJobToDLQ } from "../dlq/dlq.producer.js";
// import { delayJob } from "../delay-jobs/delay-job.js";

// const retryJob = async (delayData:delay ,jobData: job, result: JobResult): Promise<void> => {
//   try {
//     // 1️⃣ Increment tries 
//     jobData.tries += 1;
//     jobData.updatedAt = Date.now();

//     // 2️⃣ max tries exceeded → move to dlq
//     if (jobData.tries > jobData.maxTries) {
//       await moveJobToDLQ(jobData, result);
//       console.log("job added to dead letter queue");
//       return;
//     }

//     // 3️⃣ delay retry window
//     if (
//       jobData.tries >= delayData.limitOfTries &&
//       jobData.tries <= jobData.maxTries
//     ) {
//       await delayJob(jobData, delayData.retryAfterSeconds);
//       console.log("job retry after some seconds");
//       return;
//     }

//     // 4️⃣ Immediate retry
//     jobData.status = "pending";
//     const queue = getQueueKeys(jobData.queueName);
//     await redis.rPush(queue.ready, JSON.stringify(jobData));

//   } catch (err) {
//     console.error("Error retrying job:", err);
//     throw err;
//   }
// };

// export default retryJob;

import redis from "../utils/redis.js";
import { job, JobResult, delay } from "../common/job.type.js";
import { getQueueKeys } from "../common/queue.constants.js";
import { moveJobToDLQ } from "../dlq/dlq.producer.js";
import { delayJob } from "../delay-jobs/delay-job.js";
import { JobErrorCode } from "../common/failures/jobErrorCodes.js";

/* 
   IMPORTANT RETRY FUNCTIONS
*/

// decides whether a job should be retried or not
const isRetryableError = (code?: JobErrorCode): boolean => {
  if (!code) return true;

  if (
    code === JobErrorCode.INVALID_PAYLOAD ||
    code === JobErrorCode.PERMISSION_DENIED ||
    code === JobErrorCode.BAD_REQUEST
  ) {
    return false;
  }

  return true;
};

// exponential backoff with max cap
const calculateBackoffSeconds = (
  tries: number,
  baseDelaySeconds: number,
  maxDelaySeconds = 300
): number => {
  const delay = baseDelaySeconds * Math.pow(2, tries - 1);
  return Math.min(delay, maxDelaySeconds);
};

/* 
   IDEMPOTENCY LOCK
    */

const acquireRetryLock = async (jobId: string): Promise<boolean> => {
  const lockKey = `retry-lock:${jobId}`;
  const locked = await redis.set(lockKey, "1", "NX", "EX", 5);
  return locked === "OK";
};

/* 
   RETRY JOB LOGIC
*/

const retryJob = async (
  delayData: delay,
  jobData: job,
  result: JobResult
): Promise<void> => {
  try {
    // 🔒 Idempotency lock
    const locked = await acquireRetryLock(jobData.jobId);
    if (!locked) return;

    // 🔁 Increment retry count
    jobData.tries += 1;
    jobData.updatedAt = Date.now();
    jobData.lastError = result.error;

    // ❌ Non-retryable error → DLQ immediately
    if (!isRetryableError(result.error?.code)) {
      jobData.status = "dead";
      jobData.deadReason = "NON_RETRYABLE_ERROR";
      await moveJobToDLQ(jobData, result);
      return;
    }

    // max retries exceeded → DLQ
    if (jobData.tries > jobData.maxTries) {
      jobData.status = "dead";
      jobData.deadReason = "MAX_RETRIES_EXCEEDED";
      await moveJobToDLQ(jobData, result);
      return;
    }

    // delayed retry window
    if (jobData.tries >= delayData.limitOfTries) {
      const backoffSeconds = calculateBackoffSeconds(
        jobData.tries,
        delayData.retryAfterSeconds
      );

      await delayJob(jobData, backoffSeconds);
      return;
    }

    // immediate retry
    jobData.status = "pending";
    const queue = getQueueKeys(jobData.queueName);
    await redis.rPush(queue.ready, JSON.stringify(jobData));
  } catch (err) {
    console.error("Error retrying job:", err);
    throw err;
  }
};

export default retryJob;
