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
  }),
  async resolve({ ctx, input }) {
    let [For1, For2] = input.For;
    if (!For1 && !For2) {
      For1 = "Sell";
      For2 = "Rent";
    }
    const getAllEstates = await ctx.prisma.estate.findMany({
      orderBy: { [input.Sort.value]: input.Sort.order },
      where: {
        ...(input.Type !== "" ? { type: { contains: input.Type } } : {}),
        ...(input.City !== "" ? { city: { contains: input.City } } : {}),
        ...(input.minPrice !== "" ? { price: { gte: +input.minPrice} } : {}),
        ...(input.maxPrice !== "" ? { price: { lte: +input.maxPrice} } : {}),
        OR: [
          For1 ? { for: { contains: For1 } } : {},
          For2 ? { for: { contains: For2 } } : {},
        ],
      },
    });
    return getAllEstates;
  },
});

// ...(For1 ? { type: { contains: For1 } } : {}),
