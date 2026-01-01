import { router, publicProcedure } from "./trpc";
import { z } from "zod";
import { db } from "./config/db";
import { bigQueryClient } from "./config/bigquery";
import { workflowClient } from "./orpc/client";

interface StoreItem {
    id: string;
    name: string;
    price: number;
}

export const appRouter = router({
    hello: publicProcedure.query(() => {
        return "Hello from tRPC!";
    }),

    greet: publicProcedure.input(z.object({ name: z.string() })).query(({ input }) => {
        return {
            greeting: `Greetings, ${input.name}!`,
        };
    }),

    getStoreItems: publicProcedure
        .input(
            z.object({
                limit: z.number().optional(),
                cursor: z.string().optional(),
                search: z.string().optional(),
                sortBy: z.enum(["name", "price"]).optional(),
                sortOrder: z.enum(["asc", "desc"]).optional(),
            })
        )
        .query(async ({ input }) => {
            const { limit = 10, cursor, search, sortBy = "name", sortOrder = "asc" } = input;
            let query = db.collection("storeItem").orderBy(sortBy, sortOrder).limit(limit);

            if (search && sortBy === "name") {
                query = query.where("name", ">=", search).where("name", "<=", search + "\uf8ff");
            }

            if (cursor) {
                const cursorDoc = await db.collection("storeItem").doc(cursor).get();

                if (cursorDoc.exists) {
                    query = query.startAfter(cursorDoc);
                }
            }

            const snapshot = await query.get();

            const items = snapshot.docs.map((doc) => {
                return { id: doc.id, ...doc.data() };
            }) as StoreItem[];

            let nextCursor: string | undefined;

            if (snapshot.docs.length === limit) {
                const lastDoc = snapshot.docs[snapshot.docs.length - 1];
                nextCursor = lastDoc.id;
            }

            return { items, nextCursor };
        }),

    getStoreItemById: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input }) => {
            console.log("getStoreItemById", input);

            const docRef = db.collection("storeItem").doc(input.id);

            const doc = await docRef.get();

            if (!doc.exists) {
                console.error("Error fetching item Data:", doc);
                console.error("Error fetching item ID:", doc.id);
                throw new Error("Item not found");
            }

            const resItem = { id: doc.id, ...doc.data() } as StoreItem;

            return resItem;
        }),

    createStoreItem: publicProcedure
        .input(z.object({ name: z.string(), price: z.number() }))
        .mutation(async ({ input }) => {
            const newItem = {
                name: input.name,
                price: input.price,
            };

            const docRef = await db.collection("storeItem").add(newItem);

            return { id: docRef.id, ...newItem } as StoreItem;
        }),

    updateStoreItem: publicProcedure
        .input(z.object({ id: z.string(), name: z.string(), price: z.number() }))
        .mutation(async ({ input }) => {
            const newItem = {
                name: input.name,
                price: input.price,
            };

            const docRef = db.collection("storeItem").doc(input.id);

            await docRef.update(newItem);

            return { id: docRef.id, ...newItem } as StoreItem;
        }),

    deleteStoreItem: publicProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ input }) => {
            await db.collection("storeItem").doc(input.id).delete();

            return { success: true, id: input.id };
        }),

    sampleBigQuery: publicProcedure.query(async () => {
        const sqlQuery = `SELECT
        CONCAT(
          'https://stackoverflow.com/questions/',
          CAST(id as STRING)) as url,
        view_count
        FROM \`bigquery-public-data.stackoverflow.posts_questions\`
        WHERE tags like '%google-bigquery%'
        ORDER BY view_count DESC
        LIMIT 10`;

        const options = {
            query: sqlQuery,
            // location: "AU",
        };

        const [rows] = await bigQueryClient.query(options);

        console.log("Query Results:");

        rows.forEach((row) => {
            const url = row["url"];
            const viewCount = row["view_count"];
            console.log(`url: ${url}, ${viewCount} views`);
        });
    }),

    workflow: router({
        test: publicProcedure
            .input(
                z.object({
                    name: z.string(),
                    email: z.string(),
                    phone: z.string(),
                    emailMessage: z.string().optional(),
                    smsMessage: z.string().optional(),
                    subject: z.string().optional(),
                })
            )
            .mutation(async ({ input }) => {
                const client = workflowClient();
                return await client.workflow.test({
                    name: input.name,
                    email: input.email,
                    phone: input.phone,
                    emailMessage: input.emailMessage,
                    smsMessage: input.smsMessage,
                    subject: input.subject,
                });
            }),

        getStatus: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
            const client = workflowClient();
            return await client.workflow.getStatus(input);
        }),

        testEmail: publicProcedure
            .input(
                z.object({
                    email: z.string(),
                    name: z.string(),
                    subject: z.string().optional(),
                    emailMessage: z.string().optional(),
                })
            )
            .mutation(async ({ input }) => {
                const client = workflowClient();
                return await client.workflow.testEmail({
                    email: input.email,
                    name: input.name,
                    subject: input.subject,
                    emailMessage: input.emailMessage,
                });
            }),

        testSMS: publicProcedure
            .input(
                z.object({
                    phone: z.string(),
                    name: z.string(),
                    smsMessage: z.string().optional(),
                })
            )
            .mutation(async ({ input }) => {
                const client = workflowClient();
                return await client.workflow.testSMS({
                    phone: input.phone,
                    name: input.name,
                    smsMessage: input.smsMessage,
                });
            }),

        testError: publicProcedure.input(z.unknown()).mutation(async ({ input }) => {
            const client = workflowClient();
            return await client.workflow.testError(input);
        }),

        terminate: publicProcedure
            .input(z.object({ workflowId: z.string() }))
            .mutation(async ({ input }) => {
                const client = workflowClient();
                return await client.workflow.terminate(input);
            }),
    }),

    queue: router({
        send: publicProcedure
            .input(
                z.object({
                    id: z.string(),
                    data: z.object({
                        name: z.string(),
                        email: z.string(),
                        phone: z.string(),
                    }),
                })
            )
            .mutation(async ({ input }) => {
                const client = workflowClient();
                return await client.queue.send(input);
            }),
    }),
});

export type AppRouter = typeof appRouter;
