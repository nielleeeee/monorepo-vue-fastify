import { type } from "arktype";

export const SampleWorkflowInput = type({
    name: "string",
    email: "string",
    phone: "string",
    emailMessage: "string | undefined",
    smsMessage: "string | undefined",
    subject: "string | undefined",
});

export const WorkflowResponseOutput = type({
    success: "boolean",
    message: "string",
    id: "string",
});

export const GetWorkflowStatusInput = type({
    id: "string",
});

export const WorkflowStatusOutput = type({
    success: "boolean",
    message: "string",
    data: {
        status: "string",
        output: "unknown | undefined",
    },
});

export const EmailWorkflowInput = type({
    email: "string",
    name: "string",
    subject: "string | undefined",
    emailMessage: "string | undefined",
});

export const SMSWorkflowInput = type({
    phone: "string",
    name: "string",
    smsMessage: "string | undefined",
});

export const TerminateWorkflowInput = type({
    workflowId: "string",
});

export const TestErrorWorkflowInput = type("unknown");