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
    // sort: z.object({
    //   value: z.string(),
    //   order: z.string(),
    // }),
    // category: z.string(),
  }),
  async resolve({ ctx, input }) {
    const getAllEstates = await ctx.prisma.estate.findMany({
      orderBy: { name: "desc" },
      where: { type: { contains: input.Type } },
      // orderBy: { [input.sort.value]: input.sort.order },
      // where: { type: { contains: input.type.value } },
    });
    return getAllEstates;
  },
});
