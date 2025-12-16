import redis from './utils/redis';

const QUEUES = ['queue:high', 'queue:normal', 'queue:low'];

const processJob = async (job: any) => {
  console.log(` Processing job ${job.id}`);
  console.log('Payload:', job.data);

 
  await new Promise((res) => setTimeout(res, 1000));

  console.log(` Job ${job.id} completed`);
};

const startWorker = async () => {
  console.log(' Worker started. Waiting for jobs...');

  while (true) {
    try {

      const result = await redis.brPop(QUEUES, 0);

      if (!result) continue;

      const { key, element } = result;

      const job = JSON.parse(element);

      console.log(` Picked job from ${key}`);

      await processJob(job);

    } catch (err) {
      console.error(' Error processing job:', err);
    }
  }
};

process.on('SIGINT', async () => {
  console.log(' Shutting down worker...');
  await redis.quit();
  process.exit(0);
});

startWorker();
