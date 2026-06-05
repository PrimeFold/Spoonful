import type { Prisma } from "../generated/prisma/client";
import { SpotRating, Tags } from "../generated/prisma/client";

interface Filters {
  search?: string;
  tags?: Tags[]  ;
  rating?: SpotRating;
  userId?: string;
}

export const buildFoodSpotFilters = ({
  search,
  tags,
  rating,
  userId,
}: Filters): Prisma.FoodSpotsWhereInput => ({
  ...(userId && { userId }),

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