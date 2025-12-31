import { type } from "arktype";

export const QueueInput = type({
    id: "string",
    data: {
        name: "string",
        email: "string",
        phone: "string",
    },
});

export const QueueResponseOutput = type({
    success: "boolean",
    message: "string",
});
