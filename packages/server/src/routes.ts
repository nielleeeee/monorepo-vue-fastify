import { get } from "http";
import { router, publicProcedure } from "./trpc";
import { z } from "zod";
import { v4 as uuidv4 } from 'uuid';

interface StoreItem {
  id: string;
  name: string;
  price: number;
}

const sampleStoreItemDB: StoreItem[] = [
  {
    id: "1",
    name: "Sample Item 1",
    price: 100,
  },
  {
    id: "2",
    name: "Sample Item 2",
    price: 200,
  },
  {
    id: "3",
    name: "Sample Item 3",
    price: 300,
  },
  {
    id: "4",
    name: "Sample Item 4",
    price: 400,
  },
  {
    id: "5",
    name: "Sample Item 5",
    price: 500,
  },
];

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
    .query(({ input }) => {
      const { limit = 10, cursor, search, sortBy, sortOrder } = input;
      let items = sampleStoreItemDB;

      if (search) {
        items = items.filter((item) => item.name.includes(search));
      }

      if (sortBy && sortOrder) {
        items = items.sort((a, b) => {
          if (sortBy === "name") {
            if (sortOrder === "asc") {
              return a.name.localeCompare(b.name);
            } else {
              return b.name.localeCompare(a.name);
            }
          } else if (sortBy === "price") {
            if (sortOrder === "asc") {
              return a.price - b.price;
            } else {
              return b.price - a.price;
            }
          }

          return 0;
        });
      }

      let start = 0;
      if (cursor) {
        const index = items.findIndex((item) => item.id === cursor);

        if (index !== -1) {
          start = index + 1;
        }
      }

      const paginatedItems = items.slice(start, start + limit);

      let nextCursor: string | undefined;

      if (paginatedItems.length === limit) {
        const lastItem = paginatedItems[paginatedItems.length - 1];

        if (lastItem && items[start + limit]) {
          nextCursor = lastItem.id;
        }
      }

      return {
        items: paginatedItems,
        nextCursor,
      };
    }),

  getStoreItemById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      const item = sampleStoreItemDB.find((item) => item.id === input.id);

      if (!item) {
        return null;
      }

      return item;
    }),

  createStoreItem: publicProcedure.input(z.object({ name: z.string(), price: z.number() })).mutation(({ input }) => {
    const generatedId = uuidv4();

    const newItem = {
      id: generatedId,
      name: input.name,
      price: input.price,
    };

    sampleStoreItemDB.push(newItem);

    return newItem;
  }),
});

export type AppRouter = typeof appRouter;
