import {
    WorkflowEntrypoint,
    WorkflowEvent,
    WorkflowStep,
} from "cloudflare:workers";
import { Params } from "../types";

type Env = {
    TEST_WORKFLOW: Workflow;
};

export class TestWorkflow extends WorkflowEntrypoint<Env, Params> {
    async run(event: WorkflowEvent<Params>, step: WorkflowStep) {
        const { env } = this;
        const { name } = event.payload;

        if (!name) {
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
            console.log("Console Log From Workflow | Final step");
            console.log("Name: ", name);
            console.log("Workflow Completed");
            return { first, second, third };
        });
    }
}
