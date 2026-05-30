import { z } from "zod";
import { SpotRating, Tags } from "../generated/prisma/client";

export const GetFoodSpotsSchema = z.object({
  search: z.string().trim().min(1).max(50).optional(),
  tags: z.array(z.enum(Tags)).optional(),
  rating: z.enum(SpotRating).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(20).default(10)
});