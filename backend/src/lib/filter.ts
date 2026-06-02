import type { Prisma } from "../generated/prisma/client";


export const buildFoodSpotFilters = ({
  search,
  tags,
  rating,
  userId,
}: {
  search?: string;
  tags?: string[];
  rating?: string;
  userId?: string;
}): Prisma.FoodSpotsWhereInput => ({
  ...(userId && {
    userId,
  }),

  ...(search && {
    name: {
      contains: search,
      mode: "insensitive",
    },
  }),

  ...(tags?.length && {
    tags: {
      hasEvery: tags,
    },
  }),

  ...(rating && {
    spotRating: rating,
  }),
});