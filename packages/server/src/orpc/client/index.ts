import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import type { AppRouter } from "../../../../workflow/src/orpc/index";

export function workflowClient() {
    const serviceUrl = process.env.WORKFLOW_SERVICE_URL || "http://localhost:8787";

    try {
        const link = new RPCLink({
            url: `${serviceUrl}/rpc`,
            headers: () => {
                const h = new Headers();
                h.set("x-req-from", "engagement-platform");
                return h;
            },
        });

        return createORPCClient(link) as RouterClient<AppRouter>;
    } catch (error) {
        console.error(`[Service] Error creating client: ${error}`);
        throw error;
    }
}
