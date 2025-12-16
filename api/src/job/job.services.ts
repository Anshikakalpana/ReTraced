import redis from '../utils/redis';
import { job } from './job';

export const createJob = async (
  jobData: job
) => {
  try {
    const newJob: job = {
      jobId: jobData.jobId,

      createdAt: Date.now(),
      updatedAt: Date.now(),

      jobData: jobData.jobData,

      queueName: jobData.queueName,

      status: 'pending',

      tries: 0,
      maxTries: jobData.maxTries,

      type: jobData.type,
      priority: jobData.priority ?? 0,
      runAt: jobData.runAt
    };

    await redis.rPush(newJob.queueName, JSON.stringify(newJob));

  } catch (err) {
    console.error('Error adding job to queue:', err);
    throw err;
  }
};
