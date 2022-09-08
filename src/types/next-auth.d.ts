import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  enum Role {
    USER = "USER",
    PREMIUM = "PREMIUM",
  }
  interface Session {
    user?: {
      id?: string;
      role?: Role;
    } & DefaultSession["user"];
  }
  interface User {
    role?: Role,
  }
}
