import { createRouter } from "./context";
import { z } from "zod";

export const publicRouter = createRouter().query("show-estates", {
  input: z.object({
    for: z.array(z.string()),
    type: z.string(),
    city: z.string(),
    minPrice: z.string(),
    maxPrice: z.string(),
    minArea: z.string(),
    maxArea: z.string(),
    sort: z.object({
      value: z.string(),
      order: z.string(),
    }),
    skip: z.number(),
    take: z.number(),
  }),
  async resolve({ ctx, input }) {
    const where = {
      ...(input.type ? { type: { contains: input.type } } : undefined),
      ...(input.city ? { type: { contains: input.city } } : undefined),
      ...(input.for.length !== 0 ? { for: { in: input.for } } : undefined),
      AND: [
        input.minPrice ? { price: { gte: +input.minPrice } } : {},
        input.maxPrice ? { price: { lte: +input.maxPrice } } : {},
        input.minArea ? { area: { gte: +input.minArea } } : {},
        input.maxArea ? { area: { lte: +input.maxArea } } : {},
      ],
    };
    const getEstates = await ctx.prisma.$transaction([
      ctx.prisma.estate.count({
        where: where,
      }),
      ctx.prisma.estate.findMany({
        where: where,
        orderBy: { [input.sort.value]: input.sort.order },
        skip: input.skip,
        take: input.take,
      }),
    ]);
    return getEstates;
  },
});
