import { router, publicProcedure } from "./trpc";
import { z } from "zod";
import { db } from "./db";

interface StoreItem {
    id: string;
    name: string;
    price: number;
}

export const appRouter = router({
    hello: publicProcedure.query(() => {
        return "Hello from tRPC!";
    }),

    greet: publicProcedure
        .input(z.object({ name: z.string() }))
        .query(({ input }) => {
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
            const {
                limit = 10,
                cursor,
                search,
                sortBy = "name",
                sortOrder = "asc",
            } = input;
            let query = db
                .collection("storeItem")
                .orderBy(sortBy, sortOrder)
                .limit(limit);

            if (search && sortBy === "name") {
                query = query
                    .where("name", ">=", search)
                    .where("name", "<=", search + "\uf8ff");
            }

            if (cursor) {
                const cursorDoc = await db
                    .collection("storeItem")
                    .doc(cursor)
                    .get();

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
        .input(
            z.object({ id: z.string(), name: z.string(), price: z.number() })
        )
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
});

export type AppRouter = typeof appRouter;
