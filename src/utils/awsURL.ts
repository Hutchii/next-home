import { env } from "../env/client.mjs";

export const awsURL = (url: string | undefined) =>
  `${env.NEXT_PUBLIC_AWS}/${url}`;
