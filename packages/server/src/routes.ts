import { router, publicProcedure } from './trpc';
import { z } from 'zod'; 

export const appRouter = router({
  // A simple procedure that takes no input and returns a string
  hello: publicProcedure.query(() => {
    return 'Hello from tRPC!';
  }),

  // A procedure that takes a string input and returns a custom object
  greet: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Greetings, ${input.name}!`,
      };
    }),
});

// Export the *type* of the AppRouter. This is the magic part.
export type AppRouter = typeof appRouter;