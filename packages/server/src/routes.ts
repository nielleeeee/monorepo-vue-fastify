import { router, publicProcedure } from "./orpc";
import { type } from "arktype";
import { db } from "./config/db";
import { bigQueryClient } from "./config/bigquery";
import { workflowClient } from "./orpc/client";

interface StoreItem {
    id: string;
    name: string;
    price: number;
}

export const appRouter = router({
    hello: publicProcedure.handler(() => {
        return "Hello from oRPC!";
    }),

    greet: publicProcedure.input(type({ name: "string" })).handler(({ input }) => {
        return {
            greeting: `Greetings, ${input.name}!`,
        };
    }),

    getStoreItems: publicProcedure
        .input(
            type({
                "limit?": "number",
                "cursor?": "string",
                "search?": "string",
                "sortBy?": "'name' | 'price'",
                "sortOrder?": "'asc' | 'desc'",
            })
        )
        .handler(async ({ input }) => {
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

    getStoreItemById: publicProcedure.input(type({ id: "string" })).handler(async ({ input }) => {
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
        .input(type({ name: "string", price: "number" }))
        .handler(async ({ input }) => {
            const newItem = {
                name: input.name,
                price: input.price,
            };

            const docRef = await db.collection("storeItem").add(newItem);

            return { id: docRef.id, ...newItem } as StoreItem;
        }),

    updateStoreItem: publicProcedure
        .input(type({ id: "string", name: "string", price: "number" }))
        .handler(async ({ input }) => {
            const newItem = {
                name: input.name,
                price: input.price,
            };

            const docRef = db.collection("storeItem").doc(input.id);

            await docRef.update(newItem);

            return { id: docRef.id, ...newItem } as StoreItem;
        }),

    deleteStoreItem: publicProcedure.input(type({ id: "string" })).handler(async ({ input }) => {
        await db.collection("storeItem").doc(input.id).delete();

        return { success: true, id: input.id };
    }),

    sampleBigQuery: publicProcedure.handler(async () => {
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
                type({
                    name: "string",
                    email: "string",
                    phone: "string",
                    "emailMessage?": "string",
                    "smsMessage?": "string",
                    "subject?": "string",
                })
            )
            .handler(async ({ input }) => {
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

        getStatus: publicProcedure.input(type({ id: "string" })).handler(async ({ input }) => {
            const client = workflowClient();
            return await client.workflow.getStatus(input);
        }),

        testEmail: publicProcedure
            .input(
                type({
                    email: "string",
                    name: "string",
                    "subject?": "string",
                    "emailMessage?": "string",
                })
            )
            .handler(async ({ input }) => {
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
                type({
                    phone: "string",
                    name: "string",
                    "smsMessage?": "string",
                })
            )
            .handler(async ({ input }) => {
                const client = workflowClient();
                return await client.workflow.testSMS({
                    phone: input.phone,
                    name: input.name,
                    smsMessage: input.smsMessage,
                });
            }),

        testError: publicProcedure.input(type("unknown")).handler(async ({ input }) => {
            const client = workflowClient();
            return await client.workflow.testError(input);
        }),

        terminate: publicProcedure
            .input(type({ workflowId: "string" }))
            .handler(async ({ input }) => {
                const client = workflowClient();
                return await client.workflow.terminate(input);
            }),
    }),

    queue: router({
        send: publicProcedure
            .input(
                type({
                    id: "string",
                    data: {
                        name: "string",
                        email: "string",
                        phone: "string",
                    },
                })
            )
            .handler(async ({ input }) => {
                const client = workflowClient();
                return await client.queue.send(input);
            }),
    }),
});

export type AppRouter = typeof appRouter;
