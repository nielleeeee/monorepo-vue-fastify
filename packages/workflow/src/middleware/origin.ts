import { os, ORPCError } from "@orpc/server";
import type { AppContext } from "../types";

export function createOriginMiddleware<TEnv = Record<string, unknown>>() {
    return os.$context<AppContext<TEnv>>().middleware(async ({ context, next }) => {
        const isEngagementPlatform = context.headers.get("x-req-from") === "engagement-platform";

        if (!isEngagementPlatform) {
            console.log("Unauthorized access, Invalid origin");
            throw new ORPCError("UNAUTHORIZED", {
                message: "Invalid origin",
            });
        }

        return next();
    });
}
