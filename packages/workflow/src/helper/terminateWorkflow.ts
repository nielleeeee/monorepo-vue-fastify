export const terminateWorkflow = async (workflowId: string, env: Env) => {
    try {
        const res = await fetch(
            `http://localhost:8787/terminate-workflow/${workflowId}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    token: env.SAMPLE_TOKEN,
                },
            }
        );

        if (!res.ok) {
            console.error(
                `Error terminating workflow, helper function`,
                res.status
            );
        }

        return await res.json();
    } catch (error) {
        console.error("Error terminating workflow", error);
        throw new Error("Error terminating workflow");
    }
};
