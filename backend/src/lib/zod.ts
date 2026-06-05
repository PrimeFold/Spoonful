import { z } from "zod";
import { SpotRating, Tags } from "../generated/prisma/client";

export const GetFoodSpotsSchema = z.object({
  search: z.preprocess((value) => {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      return trimmed === '' ? undefined : trimmed;
    }
    return value;
  }, z.string().min(1).max(50).optional()),
  tags: z.array(z.enum(Tags)).optional(),
  rating: z.enum(SpotRating).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(20).default(10)
});
export const GetUserSubmissionsSchema = z.object({
  userId:z.string(),
  search: z.preprocess((value) => {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      return trimmed === '' ? undefined : trimmed;
    }
    return value;
  }, z.string().min(1).max(50).optional()),
  tags: z.array(z.enum(Tags)).optional(),
  rating: z.enum(SpotRating).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(20).default(10)
});


export const AddFoodSpotsSchema = z.object({
  name:z.string(),
  location:z.object({
    locality:z.string().min(3),
     town: z.string().optional().transform(val => val === "" ? undefined : val),
    city:z.string().min(3).max(30),
    state:z.string().min(3)
  }),
  spotRating:z.enum(SpotRating).optional(),
  tags:z.array(z.enum(Tags)).optional()
})