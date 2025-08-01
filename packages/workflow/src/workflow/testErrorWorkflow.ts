import {
    WorkflowEntrypoint,
    WorkflowEvent,
    WorkflowStep,
} from "cloudflare:workers";

interface Params {}

export class TestErrorWorkflow extends WorkflowEntrypoint<Env, Params> {
    async run(event: WorkflowEvent<Params>, step: WorkflowStep) {
        const { env } = this;
        const thisWorkflowId = event.instanceId;

        const first = await step.do("First step", async () => {
            console.log("Console Log From Workflow | Step 1");

            const thisWorkflowInstance = await env.TEST_ERROR_WORKFLOW.get(
                thisWorkflowId
            );

            await thisWorkflowInstance.terminate();

            console.log("It did not terminate | Step 1");
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
            return { first, second, third };
        });
    }
}
