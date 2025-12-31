import { createMiddleware } from "hono/factory";

const authMiddleware = createMiddleware(async (c, next) => {
    const token = c.req.header("token");
    const sampleToken = "sample-token";

    if (!token || token !== sampleToken) {
        console.log("Unauthorized access: ", c.req.url);
        return c.json({ error: "Unauthorized" }, 401);
    }

    await next();
});

export { authMiddleware };
