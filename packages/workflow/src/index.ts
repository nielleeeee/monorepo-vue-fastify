import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { authMiddleware } from "./middleware";
import { SampleWorkflowParams, EmailParams, SMSParams, QueueParams } from "./types";
import { TestWorkflow } from "./workflow/sampleWorkflow";
import { TestEmailWorkflow } from "./workflow/emailWorkflow";
import { TestSMSWorkflow } from "./workflow/smsWorkflow";
import { TestErrorWorkflow } from "./workflow/testErrorWorkflow";
import { queue } from "./queue";
import { router } from "./orpc";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.use(logger());

app.use(
    "*",
    cors({
        origin: "http://localhost:5173",
    })
);

app.get("/", (c) => {
    return c.text("Hello Hono!");
});

app.get("/sample-get", authMiddleware, async (c) => {
    try {
        await fetch("http://localhost:8787/");
        console.log("Sample GET");
        return c.text("Hello Hono!");
    } catch (error) {
        console.error("Sample GET Error", error);
    }
});

app.post("/test-workflow", authMiddleware, async (context) => {
    try {
        const body = await context.req.json<SampleWorkflowParams>();
        const { name, email, phone } = body;

        if (!name || !email || !phone) {
            return context.json({ success: false, message: "Missing Required body" }, 400);
        }

        let workflow = context.env.TEST_WORKFLOW;

        const workflowCreate = await workflow.create({
            id: "workflow-run-" + crypto.randomUUID(),
            params: body,
        });

        return context.json({
            success: true,
            message: "Workflow started",
            id: workflowCreate.id,
        });
    } catch (error) {
        console.error(error);
        return context.json({ success: false, message: "Failed to start workflow" }, 500);
    }
});

app.get("/test-workflow/:id", authMiddleware, async (context) => {
    try {
        const { id } = context.req.param();

        const instance = await context.env.TEST_WORKFLOW.get(id);

        const status = await instance.status();

        if (status.status === "complete") {
            return context.json({
                success: true,
                message: "Workflow completed",
                data: status.output,
            });
        }

        return context.json({
            success: true,
            message: "Workflow in progress",
            data: status,
        });
    } catch (error) {
        console.error(error);
        return context.json({ success: false, message: "Failed to get workflow status" }, 500);
    }
});

app.post("/test-workflow-email", authMiddleware, async (context) => {
    try {
        const body = await context.req.json<EmailParams>();
        const { email, name, emailMessage } = body;

        if (!email || !name || !emailMessage) {
            return context.json({ success: false, message: "Missing body" }, 400);
        }

        let workflow = context.env.TEST_EMAIL_WORKFLOW;

        const workflowCreate = await workflow.create({
            id: "workflow-run-" + crypto.randomUUID(),
            params: body,
        });

        return context.json({
            success: true,
            message: "Workflow Email started",
            id: workflowCreate.id,
        });
    } catch (error) {
        console.error("error sending email", error);
        return context.json({ success: false, message: "Failed to send email" }, 500);
    }
});

app.post("/test-workflow-sms", authMiddleware, async (context) => {
    try {
        const body = await context.req.json<SMSParams>();
        const { phone, name, smsMessage } = body;

        if (!phone || !name || !smsMessage) {
            return context.json({ success: false, message: "Missing body" }, 400);
        }

        let workflow = context.env.TEST_SMS_WORKFLOW;
        console.log("SMS Body: ", body);

        const workflowCreate = await workflow.create({
            id: "workflow-run-" + crypto.randomUUID(),
            params: body,
        });

        return context.json({
            success: true,
            message: "Workflow SMS started",
            id: workflowCreate.id,
        });
    } catch (error) {
        console.error("error sending sms", error);
        return context.json({ success: false, message: "Failed to send sms" }, 500);
    }
});

app.post("/test-workflow-error", authMiddleware, async (context) => {
    try {
        const body = await context.req.json();

        let workflow = context.env.TEST_ERROR_WORKFLOW;

        const workflowCreate = await workflow.create({
            id: "workflow-run-" + crypto.randomUUID(),
            params: body,
        });

        return context.json({
            success: true,
            message: "Workflow SMS started",
            id: workflowCreate.id,
        });
    } catch (error) {
        console.error("error sending sms", error);
        return context.json({ success: false, message: "Failed to send sms" }, 500);
    }
});

app.delete("terminate-workflow/:workflowId", authMiddleware, async (context) => {
    const { workflowId } = context.req.param();

    try {
        const workflowInstance = await context.env.TEST_ERROR_WORKFLOW.get(workflowId);

        if (!workflowInstance) {
            return context.json({ success: false, message: "Workflow not found" }, 404);
        }

        const status = await workflowInstance.status();
        console.log("Workflow status:", status);

        if (status.status === "terminated" || status.status === "complete") {
            return context.json({
                success: true,
                message: `Workflow already ${status.status}`,
            });
        }

        await workflowInstance.terminate();

        return context.json({
            success: true,
            message: "Workflow terminated",
        });
    } catch (error) {
        console.error("error terminating workflow", error);

        return context.json({ success: false, message: "Failed to terminate workflow" }, 500);
    }
});

app.post("/test-workflow-queue", authMiddleware, async (context) => {
    try {
        const body = await context.req.json<QueueParams>();
        const { id, data } = body;
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

        return context.json({
            success: true,
            message: "Queue sent",
        });
    } catch (error) {
        console.error("error sending queue", error);
    }
});

const handler = new RPCHandler(router, {
    interceptors: [
        onError((error) => {
            console.error("[API] ORPC Error:", (error as any).message);
        }),
    ],
});

app.use("/rpc/*", async (c, next) => {
    const { matched, response } = await handler.handle(c.req.raw, {
        prefix: "/rpc",
        context: {
            headers: c.req.raw.headers,
            env: c.env,
        },
    });

    if (matched) {
        return c.newResponse(response.body, response);
    }

    await next();
});

// Export the workflows
export { TestWorkflow, TestEmailWorkflow, TestSMSWorkflow, TestErrorWorkflow };

export default {
    fetch: app.fetch,
    queue: queue,
};
