import Fastify from "fastify";
import cors from "@fastify/cors";
import { RPCHandler } from "@orpc/server/fastify";
import { onError } from "@orpc/server";
import { appRouter } from "./routes";

const server = Fastify({
    logger: true,
});

await server.register(cors, {
    origin: "*",
});

const handler = new RPCHandler(appRouter, {
    interceptors: [
        onError((error) => {
            console.error("[Server] ORPC Error:", (error as any).message);
        }),
    ],
});

server.all("/api/*", async (req, reply) => {
    const { matched } = await handler.handle(req, reply, {
        prefix: "/api",
        context: {},
    });

    if (!matched) {
        reply.status(404).send("Not found");
    }
});

const start = async () => {
    try {
        await server.listen({ port: 3000 });
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();
