import { QueueParams } from "../types";

export const queue = async (batch: MessageBatch<QueueParams>, env: CloudflareBindings) => {
    console.log("~~~~~ Backup Queue ~~~~~", batch);
    const kv = env.KV;

    console.log("~~~~~ Queue ~~~~~", batch.queue);   

    for (const message of batch.messages) {
        const { id, data } = message.body;
        const lockKey = `queue:processed:${id}`;

        try {
            console.log("~~~~~ Queue Processed ~~~~~", id, data);

            message.ack();
        } catch (error) {
            await kv.delete(lockKey);

            console.error("Queue failed:", error);
            message.retry();
        }
    }
};
