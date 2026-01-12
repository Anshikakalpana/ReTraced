// processDLQJob(dlqJob)
//   ├─ inspect error
//   ├─ decide retry / discard
//   ├─ requeue original job




import redis from "../utils/redis.js";
import { getQueueKeys } from "../common/queue.constants.js";
import { permanentFailures , temporaryFailures } from "../common/failures/error.type.js";
import { job as Job } from "../common/job.type.js";



export const processDLQJob = async (dlqJob: Job): Promise<void> => {
  if (!dlqJob) {
    throw new Error("Invalid DLQ job");
  }

  if (!dlqJob.lastError ) {
    console.error("DLQ job has no error metadata", { jobId: dlqJob.jobId });
    return;
  }

  const queue = getQueueKeys(dlqJob.queueName);
  const error = typeof dlqJob.lastError === 'string' ? JSON.parse(dlqJob.lastError) : dlqJob.lastError;

  


  if (permanentFailures.has(error?.code)) {
    await redis.lRem(queue.dlq, 0, JSON.stringify(dlqJob));

    console.log("DLQ job permanently discarded", {
      jobId: dlqJob.jobId,
      errorCode: error?.code,
    });

    return;
  }

  
  

  if (temporaryFailures.has(error?.code)) {
    const retryJob: Job = {
      ...dlqJob,
      tries: 0,
      status: "pending",
      lastError: undefined,
      updatedAt: Date.now(),
    };

    await redis.multi()
      .lRem(queue.dlq, 0, JSON.stringify(dlqJob)) // remove from DLQ
      .rPush(queue.ready, JSON.stringify(retryJob)) // requeue
      .exec();

    console.log("DLQ job manually retried", {
      jobId: retryJob.jobId,
      queue: retryJob.queueName,
    });

    return;
  }


  

  console.warn("DLQ job retained (unknown failure type)", {
    jobId: dlqJob.jobId,
    error: error?.code,
  });
};
