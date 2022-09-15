import { createProtectedRouter } from "./create-protected-router";
import * as AWS from "aws-sdk";
import { randomUUID } from "crypto";
import { env } from "./../../env/server.mjs";
import { z } from "zod";
import * as trpc from "@trpc/server";

const s3 = new AWS.S3({
  region: "eu-central-1",
  signatureVersion: "v4",
  apiVersion: "2006-03-01",
  accessKeyId: env.ACCESS_KEY,
  secretAccessKey: env.SECRET_KEY,
});

export const protectedRouter = createProtectedRouter()
  .mutation("createPresignedUrl", {
    input: z.object({
      name: z.string().min(3),
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
      const estatesCount = await ctx.prisma.user.findMany({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          Estate: true,
        },
      });
      console.log("COUNT", estatesCount);
      if (ctx.session.user.role === "USER" && estatesCount[0]?.Estate.length >= 5) {
        throw new trpc.TRPCError({
          code: "FORBIDDEN",
          message: "You can`t add more than 5 estates!",
        });
      }
      if (ctx.session.user.role === "PREMIUM" && estatesCount[0]?.Estate.length >= 10) {
        throw new trpc.TRPCError({
          code: "FORBIDDEN",
          message: "You can`t add more than 10 estates!",
        });
      }
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
  })
  .mutation("editProfile", {
    input: z.object({
      name: z.string(),
      phone: z.string(),
      contactEmail: z.string(),
    }),
    async resolve({ ctx, input }) {
      await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          name: input.name,
          phone: input.phone,
          contactEmail: input.contactEmail,
        },
      });
    },
  })
  .query("getUser", {
    async resolve({ ctx }) {
      return await ctx.prisma.user.findFirst({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          email: true,
          name: true,
          phone: true,
          contactEmail: true,
        },
      });
    },
  })
  .query("getEstates", {
    async resolve({ ctx }) {
      return await ctx.prisma.estate.findMany({
        where: {
          userId: ctx.session.user.id,
        },
      });
    },
  })
  .mutation("addFavourites", {
    input: z.object({
      id: z.string(),
      action: z.boolean(),
    }),
    async resolve({ ctx, input }) {
      const data = await ctx.prisma.estate.findFirst({
        where: {
          id: input.id,
        },
        select: {
          favouritesId: true,
        },
      });
      const filteredData = data?.favouritesId.map((f) => ({ id: f.id })) || [];
      await ctx.prisma.estate.update({
        where: {
          id: input.id,
        },
        data: {
          favouritesId: {
            set: input.action
              ? filteredData.filter((f) => f.id !== ctx.session.user.id)
              : [...filteredData, { id: ctx.session.user.id }],
          },
        },
      });
    },
    // async resolve({ ctx, input }) {
    //   const data = await ctx.prisma.user.findFirst({
    //     where: {
    //       id: ctx.session.user.id,
    //     },
    //     select: {
    //       Favourite: true,
    //     },
    //   });
    //   const filteredData = data?.Favourite.map((f) => ({ id: f.id })) || [];
    //   await ctx.prisma.user.update({
    //     where: {
    //       id: ctx.session.user.id,
    //     },
    //     data: {
    //       Favourite: {
    //         set: input.action
    //           ? filteredData.filter((f) => f.id !== input.id)
    //           : [...filteredData, { id: input.id }],
    //       },
    //     },
    //   });
    // },
  })
  .query("getFavourites", {
    async resolve({ ctx }) {
      return await ctx.prisma.estate.findMany({
        where: {
          favouritesId: {
            some: { id: ctx.session.user.id },
          },
        },
      });
    },
  });
