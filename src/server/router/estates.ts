import { createRouter } from "./context";
import { z } from "zod";

export const estatesRouter = createRouter().query("show-estates", {
  input: z.object({
    For: z.array(z.string()),
    Type: z.string(),
    City: z.string(),
    minPrice: z.string(),
    maxPrice: z.string(),
    minArea: z.string(),
    maxArea: z.string(),
    Sort: z.object({
      value: z.string(),
      order: z.string(),
    }),
    skip: z.number(),
    take: z.number(),
  }),
  async resolve({ ctx, input }) {
    let [For1, For2] = input.For;
    if (!For1 && !For2) {
      For1 = "Sell";
      For2 = "Rent";
    }
    const getEstates = await ctx.prisma.$transaction([
      ctx.prisma.estate.count({
        where: {
          type: { contains: input.Type },
          city: { contains: input.City },
          AND: [
            input.minPrice !== "" ? { price: { gte: +input.minPrice } } : {},
            input.maxPrice !== "" ? { price: { lte: +input.maxPrice } } : {},
            input.minArea !== "" ? { area: { gte: +input.minArea } } : {},
            input.maxArea !== "" ? { area: { lte: +input.maxArea } } : {},
          ],
          OR: [
            For1 ? { for: { contains: For1 } } : {},
            For2 ? { for: { contains: For2 } } : {},
          ],
        },
      }),
      ctx.prisma.estate.findMany({
        skip: input.skip,
        take: input.take,
        where: {
          type: { contains: input.Type },
          city: { contains: input.City },
          AND: [
            input.minPrice !== "" ? { price: { gte: +input.minPrice } } : {},
            input.maxPrice !== "" ? { price: { lte: +input.maxPrice } } : {},
            input.minArea !== "" ? { area: { gte: +input.minArea } } : {},
            input.maxArea !== "" ? { area: { lte: +input.maxArea } } : {},
          ],
          OR: [
            For1 ? { for: { contains: For1 } } : {},
            For2 ? { for: { contains: For2 } } : {},
          ],
        },
        orderBy: { [input.Sort.value]: input.Sort.order },
      }),
    ]);
    return getEstates;
  },
});
