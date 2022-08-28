import { createProtectedRouter } from "./create-protected-router";

// Example router with queries that can only be hit if the user requesting is signed in
export const protectedRouter = createProtectedRouter()
  .query("getSession", {
    resolve({ ctx }) {
      return ctx.session;
    },
  })
