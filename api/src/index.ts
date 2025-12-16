import express, { Request, Response } from 'express';
import redis from './utils/redis';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

const startServer = async () => {
  try {
    console.log('Waiting for Redis connection...');
    await redis.ping();
    console.log('Redis connected, starting server...');

    app.listen(3000, () => {
      console.log('Server running on http://localhost:3000');
    });
  } catch (err) {
    console.error('Cannot start API, Redis unavailable:', err);
    process.exit(1);
  }
};

startServer();
