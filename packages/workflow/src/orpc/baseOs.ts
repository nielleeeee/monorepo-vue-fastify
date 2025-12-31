import { os } from "@orpc/server";
import { createOriginMiddleware } from "../middleware/origin";
import type { AppContext } from "../types";

export function createBaseOs<TEnv = Record<string, unknown>>() {
    return os.$context<AppContext<TEnv>>().use(createOriginMiddleware<TEnv>());
}

export const baseOs = createBaseOs<CloudflareBindings>();
