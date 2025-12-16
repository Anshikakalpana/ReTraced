export  type job = {
  jobId: string,

  createdAt: number,
  updatedAt?: number,

  jobData: object,

  queueName: string,

  status: 'pending' | 'processing' | 'completed' | 'failed' | 'dead',

  tries: number,
  maxTries: number,

  lastError?: string,
  deadReason?: string,

  type?: string,
  priority?: number,
  runAt?: number
};




export type JobError = {
  message: string;
  stack?: string;
  failedAt: number;
};




export type JobResult = {
  success: boolean,
  tries: number,
  output?: any,
  error?: JobError,
  completedAt: number;
};
