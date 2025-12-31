import { baseOs } from "../orpc/baseOs";
import {
    SampleWorkflowInput,
    WorkflowResponseOutput,
    GetWorkflowStatusInput,
    WorkflowStatusOutput,
    EmailWorkflowInput,
    SMSWorkflowInput,
    TerminateWorkflowInput,
    TestErrorWorkflowInput,
} from "../schema/workflow";

export const workflowRouter = {
    test: baseOs
        .input(SampleWorkflowInput)
        .output(WorkflowResponseOutput)
        .handler(async ({ input, context }) => {
            const { name, email, phone } = input;

            if (!name || !email || !phone) {
                throw new Error("Missing required fields");
            }

            const workflow = context.env.TEST_WORKFLOW;

            const workflowCreate = await workflow.create({
                id: "workflow-run-" + crypto.randomUUID(),
                params: input,
            });

            return {
                success: true,
                message: "Workflow started",
                id: workflowCreate.id,
            };
        }),

    getStatus: baseOs
        .input(GetWorkflowStatusInput)
        .output(WorkflowStatusOutput)
        .handler(async ({ input, context }) => {
            const { id } = input;

            const instance = await context.env.TEST_WORKFLOW.get(id);
            const status = await instance.status();

            if (status.status === "complete") {
                return {
                    success: true,
                    message: "Workflow completed",
                    data: {
                        status: status.status,
                        output: status.output,
                    },
                };
            }

            return {
                success: true,
                message: "Workflow in progress",
                data: {
                    status: status.status,
                    output: status.output,
                },
            };
        }),

    testEmail: baseOs
        .input(EmailWorkflowInput)
        .output(WorkflowResponseOutput)
        .handler(async ({ input, context }) => {
            const { email, name, emailMessage } = input;

            if (!email || !name || !emailMessage) {
                throw new Error("Missing required fields");
            }

            const workflow = context.env.TEST_EMAIL_WORKFLOW;

            const workflowCreate = await workflow.create({
                id: "workflow-run-" + crypto.randomUUID(),
                params: input,
            });

            return {
                success: true,
                message: "Workflow Email started",
                id: workflowCreate.id,
            };
        }),

    testSMS: baseOs
        .input(SMSWorkflowInput)
        .output(WorkflowResponseOutput)
        .handler(async ({ input, context }) => {
            const { phone, name, smsMessage } = input;

            if (!phone || !name || !smsMessage) {
                throw new Error("Missing required fields");
            }

            const workflow = context.env.TEST_SMS_WORKFLOW;

            const workflowCreate = await workflow.create({
                id: "workflow-run-" + crypto.randomUUID(),
                params: input,
            });

            return {
                success: true,
                message: "Workflow SMS started",
                id: workflowCreate.id,
            };
        }),

    testError: baseOs
        .input(TestErrorWorkflowInput)
        .output(WorkflowResponseOutput)
        .handler(async ({ input, context }) => {
            const workflow = context.env.TEST_ERROR_WORKFLOW;

            const workflowCreate = await workflow.create({
                id: "workflow-run-" + crypto.randomUUID(),
                params: input,
            });

            return {
                success: true,
                message: "Workflow Error started",
                id: workflowCreate.id,
            };
        }),

    terminate: baseOs
        .input(TerminateWorkflowInput)
        .output(WorkflowResponseOutput)
        .handler(async ({ input, context }) => {
            const { workflowId } = input;

            const workflowInstance = await context.env.TEST_ERROR_WORKFLOW.get(workflowId);

            if (!workflowInstance) {
                throw new Error("Workflow not found");
            }

            const status = await workflowInstance.status();

            if (status.status === "terminated" || status.status === "complete") {
                return {
                    success: true,
                    message: `Workflow already ${status.status}`,
                    id: workflowId,
                };
            }

            await workflowInstance.terminate();

            return {
                success: true,
                message: "Workflow terminated",
                id: workflowId,
            };
        }),
};

export type WorkflowRouter = typeof workflowRouter;
