import { createProtectedRouter } from "./create-protected-router";
import * as AWS from "aws-sdk";
import { randomUUID } from "crypto";
import { env } from "./../../env/server.mjs";

import { z } from "zod";
const s3 = new AWS.S3({
  region: "eu-central-1",
  signatureVersion: "v4",
  apiVersion: '2006-03-01',
  accessKeyId: env.ACCESS_KEY,
  secretAccessKey: env.SECRET_KEY,
});

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
      const key = randomUUID();
      await ctx.prisma.estate.create({
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
          userId: ctx.session.user.id as string,
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
            resolve(signed);
          }
        );
      });
    },
  }
);
