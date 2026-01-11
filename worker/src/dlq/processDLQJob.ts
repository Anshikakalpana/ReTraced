// processDLQJob(dlqJob)
//   ├─ inspect error
//   ├─ decide retry / discard
//   ├─ requeue original job

import { job } from "../common/job.type";
import redis from "../utils/redis.js";
export const processsDLQJob = async(job:job):Promise<void>=>{

if(!job){
    throw new Error("Invalid job provided for DLQ processing");
}

const errorInfo=job.lastError;

if(!errorInfo){
    console.error("No error information found in DLQ job", { jobId: job.jobId });
    return;
}
if(errorInfo.message.includes("permanent")){
    redis.lrem(job.queueName,0,JSON.stringify(job));
    console.log("DLQ job discarded permanently", { jobId: job.jobId });
    return;
}
redis.rPush(job.queueName,JSON.stringify(job));


}