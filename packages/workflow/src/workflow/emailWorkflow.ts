import {
    WorkflowEntrypoint,
    WorkflowEvent,
    WorkflowStep,
} from "cloudflare:workers";
import { EmailParams } from "../types";
import { sendEmail } from "../helper/email";

export class TestEmailWorkflow extends WorkflowEntrypoint<Env, EmailParams> {
    async run(event: WorkflowEvent<EmailParams>, step: WorkflowStep) {
        const { env } = this;
        const { name, email, subject, emailMessage } = event.payload;

        if (!name || !email || !emailMessage) {
            throw new Error("Missing name params");
        }

        const first = await step.do("First step", async () => {
            console.log("Console Log From Workflow | Step 1");
            return "First step";
        });

        const second = await step.do("Second step", async () => {
            console.log("Console Log From Workflow | Step 2");
            return "Second step";
        });

        const third = await step.do("Third step", async () => {
            console.log("Console Log From Workflow | Step 3");
            return "Third step";
        });

        await step.do("Final step", async () => {
            await sendEmail(event.payload, env);

            return { first, second, third };
        });
    }
}
