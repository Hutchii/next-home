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
    const whereInput = {
      type: { contains: input.type },
      city: { contains: input.city },
      ...(input.for.length !== 0 ? { for: { in: input.for } } : {}),
      AND: [
        { price: { gte: +input.minPrice } },
        { price: { lte: +input.maxPrice } },
        { area: { gte: +input.minArea } },
        { area: { lte: +input.maxArea } },
      ],
    };
    const getEstates = await ctx.prisma.$transaction([
      ctx.prisma.estate.count({
        where: whereInput,
      }),
      ctx.prisma.estate.findMany({
        where: whereInput,
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
