import { createBaseOs, baseOs } from "./baseOs";
export { createBaseOs, baseOs };

import { workflowRouter } from "../routes/workflow";
import { queueRouter } from "../routes/queue";

export const router = baseOs.router({
    workflow: workflowRouter,
    queue: queueRouter,
});

export type AppRouter = typeof router;
