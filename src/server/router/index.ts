// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { protectedRouter } from "./protected-router";
import { estatesRouter } from "./estates";
// import { userRouter } from "./user";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("auth.", protectedRouter)
  .merge("estates.", estatesRouter)
  // .merge("user.", userRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
