import { createProtectedRouter } from "./create-protected-router";
import * as AWS from "aws-sdk";
import { env } from "../../env/server.mjs";
import { randomUUID } from "crypto";
import { z } from "zod";
const s3 = new AWS.S3({
  region: "eu-central-1",
  signatureVersion: "v4",
  // apiVersion: "2006-03-01",
  // accessKeyId: env.AWS_ACCESS_KEY_ID,
  // secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
});
// import { S3Client } from "@aws-sdk/client-s3";

// Example router with queries that can only be hit if the user requesting is signed in
export const userRouter = createProtectedRouter().mutation(
  "createPresignedUrl",
  {
    input: z.object({
      name: z.string(),
      for: z.string(),
      type: z.string(),
      city: z.string(),
      address: z.string(),
      price: z.string(),
      area: z.string(),
      rooms: z.string(),
      body: z.string(),
    }),
    async resolve({ ctx, input }) {
      const userId = ctx.session.user.id;
      const key = randomUUID();
      await prisma?.estate.create({
        data: {
          name: input.name,
          for: input.for,
          type: input.type,
          city: input.city,
          address: input.address,
          price: +input.price,
          area: +input.area,
          rooms: +input.rooms,
          body: input.body,
          userId: userId,
          Image: key,
        },
      });
      return new Promise((resolve, reject) => {
        s3.createPresignedPost(
          {
            Fields: {
              key: key,
            },
            Conditions: [
              ["starts-with", "$Content-Type", "image/"],
              ["content-length-range", 0, 1000000],
            ],
            Expires: 60,
            Bucket: "next-home",
          },
          (err, signed) => {
            if (err) return reject(err);
            console.log(signed);
            resolve(signed);
          }
        );
      });
    },
  }
);
// {
//   region: env.AWS_DEFAULT_REGION,
//   credentials: {
//     accessKeyId: env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
//   },
// }

// id      String   @id @default(cuid())
// name    String
// Image   String[]
// for     String
// type    String
// city    String
// address String
// price   Int
// area    Float
// rooms   Int
// body    String   @db.Text
// userId  String
// user    User     @relation(fields: [userId], references: [id])
