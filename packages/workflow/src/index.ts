import { Hono } from "hono";
import { logger } from "hono/logger";
import { poweredBy } from "hono/powered-by";
import { cors } from "hono/cors";
import { authMiddleware } from "./middleware";
import { EmailParams, Params, SMSParams } from "./types";
import { TestWorkflow } from "./workflow/sampleWorkflow";
import { TestEmailWorkflow } from "./workflow/emailWorkflow";
import { TestSMSWorkflow } from "./workflow/smsWorkflow";

const app = new Hono<{ Bindings: Env }>();

app.use(logger());
app.use(poweredBy());

app.use(
    "*",
    cors({
        origin: "http://localhost:5173",
    })
);

app.get("/", (c) => {
    return c.text("Hello Hono!");
});

app.post("/test-workflow", authMiddleware, async (context) => {
    try {
        const body = await context.req.json<Params>();

        if (!body || !body.name) {
            return context.json(
                { success: false, message: "Missing body" },
                400
            );
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
        return context.json(
            { success: false, message: "Failed to start workflow" },
            500
        );
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
        return context.json(
            { success: false, message: "Failed to get workflow status" },
            500
        );
    }
});

app.post("/test-workflow-email", authMiddleware, async (context) => {
    try {
        const body = await context.req.json<EmailParams>();
        const { email, name, text } = body;

        if (!email || !name || !text) {
            return context.json(
                { success: false, message: "Missing body" },
                400
            );
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
        return context.json(
            { success: false, message: "Failed to send email" },
            500
        );
    }
});

app.post("/test-workflow-sms", authMiddleware, async (context) => {
    try {
        const body = await context.req.json<SMSParams>();
        const { phone, name, text } = body;

        if (!phone || !name || !text) {
            return context.json(
                { success: false, message: "Missing body" },
                400
            );
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
        return context.json(
            { success: false, message: "Failed to send sms" },
            500
        );
    }
});

export { TestWorkflow, TestEmailWorkflow, TestSMSWorkflow };

export default {
    fetch: app.fetch,
};
