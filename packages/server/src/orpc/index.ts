import { os } from "@orpc/server";

const orpc = os.$context<Record<string, never>>();

export const router = orpc.router;
export const publicProcedure = orpc;
