import { createProtectedRouter } from "./create-protected-router";
import * as AWS from "aws-sdk";
import { env } from "../../env/server.mjs";
import { randomUUID } from "crypto";
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
    async resolve({ ctx }) {
      const userId = ctx.session.user.id;

      const image = await prisma?.image.create({
        data: {
          url: userId!,
        },
      });
      return new Promise((resolve, reject) => {
        s3.createPresignedPost(
          {
            Fields: {
              key: `${userId}/${image?.id}`,
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
