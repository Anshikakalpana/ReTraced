// import { fetchNextJob } from '../index.js';

// import { getQueueKeys } from '../common/queue.constants.js';

// const QUEUES= ['dlq'];


// const deadJob = fetchNextJob('dlq');

// const startDlqWorker = async()=>{
//     console.log('DLQ Worker started. Waiting for DLQ jobs...');

//     while(deadJob){
//         try{
//             const job = await deadJob;

//             if(!job)continue;
//             //process DLQ job here
//           //  processDLQJob(job);
//         }
//     }

// }

