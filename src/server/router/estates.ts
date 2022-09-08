import { createRouter } from "./context";
import { z } from "zod";

export const estatesRouter = createRouter().query("show-estates", {
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
      type: { contains: input.type },
      city: { contains: input.city },
      ...(input.for.length !== 0 ? { for: { in: input.for } } : {}),
      AND: [
        input.minPrice !== "" ? { price: { gte: +input.minPrice } } : {},
        input.maxPrice !== "" ? { price: { lte: +input.maxPrice } } : {},
        input.minArea !== "" ? { area: { gte: +input.minArea } } : {},
        input.maxArea !== "" ? { area: { lte: +input.maxArea } } : {},
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

// OR: [
//   For1 ? { for: { contains: For1 } } : {},
//   // For2 ? { for: { contains: For2 } } : {},
// ],
