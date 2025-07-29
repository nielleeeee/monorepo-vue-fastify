import {
    WorkflowEntrypoint,
    WorkflowEvent,
    WorkflowStep,
} from "cloudflare:workers";
import { sendEmail } from "../helper/email";
import { sendSMS } from "../helper/sms";
import { SampleWorkflowParams } from "../types";

export class TestWorkflow extends WorkflowEntrypoint<
    Env,
    SampleWorkflowParams
> {
    async run(event: WorkflowEvent<SampleWorkflowParams>, step: WorkflowStep) {
        const { env } = this;
        const { name, email, phone, emailMessage, smsMessage, subject } =
            event.payload;

        if (!name || !email || !phone) {
            throw new Error("Missing required params");
        }

        const sendEmailProps = {
            email,
            name,
            subject: subject ?? "Sample Workflow Email",
            emailMessage: emailMessage ?? "This is the email body",
        };

        const sendSMSProps = {
            phone,
            name,
            smsMessage: smsMessage ?? "This is the SMS body",
        };
        

        const first = await step.do("First step", async () => {
            console.log("Console Log From Workflow | Step 1 | Starting");

            return "First step";
        });
        
        const second = await step.do("Second step", async () => {
            console.log("Console Log From Workflow | Step 2 | Sending Email");

            const sendEmailResult = await sendEmail(sendEmailProps, env);

            return sendEmailResult;
        });

        const third = await step.do("Third step", async () => {
            console.log("Console Log From Workflow | Step 3 | Sending SMS");

            const sendSMSResult = await sendSMS(sendSMSProps, env);

            return sendSMSResult;
        });

        await step.do("Final step", async () => {
            console.log("Console Log From Workflow | Final step");
            console.log("Workflow Completed");
            return { first, second, third };
        });
    }
}
