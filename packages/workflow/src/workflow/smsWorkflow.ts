import {
    WorkflowEntrypoint,
    WorkflowEvent,
    WorkflowStep,
} from "cloudflare:workers";
import { SMSParams } from "../types";
import { sendSMS } from "../helper/sms";

export class TestSMSWorkflow extends WorkflowEntrypoint<Env, SMSParams> {
    async run(event: WorkflowEvent<SMSParams>, step: WorkflowStep) {
        const { env } = this;
        const { name, phone, smsMessage } = event.payload;

        if (!name || !phone || !smsMessage) {
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
            await sendSMS(event.payload, env);

            return { first, second, third };
        });
    }
}
