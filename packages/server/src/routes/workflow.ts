import { orpc } from "../orpc/baseOs";
import { type } from "arktype";
import { workflowClient } from "../orpc/client";

export const workflowRouter = {
    test: orpc
        .input(
            type({
                name: "string",
                email: "string",
                phone: "string",
                "emailMessage?": "string",
                "smsMessage?": "string",
                "subject?": "string",
            })
        )
        .handler(async ({ input }) => {
            const client = workflowClient();
            return await client.workflow.test({
                name: input.name,
                email: input.email,
                phone: input.phone,
                emailMessage: input.emailMessage,
                smsMessage: input.smsMessage,
                subject: input.subject,
            });
        }),

    getStatus: orpc.input(type({ id: "string" })).handler(async ({ input }) => {
        const client = workflowClient();
        return await client.workflow.getStatus(input);
    }),

    testEmail: orpc
        .input(
            type({
                email: "string",
                name: "string",
                "subject?": "string",
                "emailMessage?": "string",
            })
        )
        .handler(async ({ input }) => {
            const client = workflowClient();
            return await client.workflow.testEmail({
                email: input.email,
                name: input.name,
                subject: input.subject,
                emailMessage: input.emailMessage,
            });
        }),

    testSMS: orpc
        .input(
            type({
                phone: "string",
                name: "string",
                "smsMessage?": "string",
            })
        )
        .handler(async ({ input }) => {
            const client = workflowClient();
            return await client.workflow.testSMS({
                phone: input.phone,
                name: input.name,
                smsMessage: input.smsMessage,
            });
        }),

    testError: orpc.input(type("unknown")).handler(async ({ input }) => {
        const client = workflowClient();
        return await client.workflow.testError(input);
    }),

    terminate: orpc
        .input(type({ workflowId: "string" }))
        .handler(async ({ input }) => {
            const client = workflowClient();
            return await client.workflow.terminate(input);
        }),
};

export type WorkflowRouter = typeof workflowRouter;

