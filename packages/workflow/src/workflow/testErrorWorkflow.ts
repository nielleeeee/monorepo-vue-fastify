import { WorkflowEntrypoint, WorkflowEvent, WorkflowStep } from "cloudflare:workers";

export class TestErrorWorkflow extends WorkflowEntrypoint<CloudflareBindings, unknown> {
    async run(event: WorkflowEvent<unknown>, step: WorkflowStep) {
        const { env } = this;
        const thisWorkflowId = event.instanceId;
        const kv = env.KV;

        const first = await step.do("First step", async () => {
            try {
                console.log("Console Log From Workflow | Step 1");

                const kvTest = await kv.get(["test", "key", "not", "found"]);

                console.log("Test KV:", kvTest);

                console.log("It did not terminate | Step 1");

                return {
                    toSkip: true,
                };
            } catch (error) {
                return {
                    toSkip: true,
                };
            }
        });

        if (first.toSkip) {
            return;
        }

        const second = await step.do("Second step", async () => {
            try {
                console.log("Console Log From Workflow | Step 2");
                console.log("It did not terminate | Step 2");

                return { toSkip: false };
            } catch (error) {
                return { toSkip: true };
            }
        });

        const third = await step.do("Third step", async () => {
            if (second.toSkip) {
                return { toSkip: true };
            }

            console.log("Console Log From Workflow | Step 3");
            console.log("It did not terminate | Step 3");
            return "Third step";
        });

        await step.do("Final step", async () => {
            console.log("Console Log From Workflow | Final step");

            return { first, second, third };
        });
    }
}
