// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { publicRouter } from "./estates";
import { protectedRouter } from "./user";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("estates.", publicRouter)
  .merge("user.", protectedRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
