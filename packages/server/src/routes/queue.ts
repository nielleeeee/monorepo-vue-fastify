import { orpc } from "../orpc/baseOs";
import { type } from "arktype";
import { workflowClient } from "../orpc/client";

export const queueRouter = {
    send: orpc
        .input(
            type({
                id: "string",
                data: {
                    name: "string",
                    email: "string",
                    phone: "string",
                },
            })
        )
        .handler(async ({ input }) => {
            const client = workflowClient();
            return await client.queue.send(input);
        }),
};

export type QueueRouter = typeof queueRouter;

