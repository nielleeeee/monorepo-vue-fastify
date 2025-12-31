import { baseOs } from "../orpc/baseOs";
import { QueueInput, QueueResponseOutput } from "../schema/queue";

export const queueRouter = {
    send: baseOs
        .input(QueueInput)
        .output(QueueResponseOutput)
        .handler(async ({ input, context }) => {
            const { id, data } = input;
            const env = context.env;
            const queue = env.SAMPLE_QUEUE;
            const queue2 = env.SAMPLE_QUEUE_2;

            await queue.send({
                id,
                data,
            });

            await queue2.send({
                id,
                data,
            });

            return {
                success: true,
                message: "Queue sent",
            };
        }),
};

export type QueueRouter = typeof queueRouter;
