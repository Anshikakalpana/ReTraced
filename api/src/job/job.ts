import redis from '../utils/redis';

export const addJobToQueue = async (
  jobId: string,
  jobData: object,
  queueName: string = 'jobQueue'
) => {
  try {
    const newJob = {
      id: jobId,
      data: jobData,
      createdAt: Date.now(),
      queue: queueName,
    };

    await redis.rpush(queueName, JSON.stringify(newJob));

  } catch (err) {
    console.error('Error adding job to queue:', err);
    throw err;
  }
};
