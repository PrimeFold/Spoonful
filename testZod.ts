import { GetFoodSpotsSchema } from "./backend/src/lib/zod";

const result = GetFoodSpotsSchema.safeParse({ page: "1", limit: "10", tags: "VEG" });
console.log("RESULT WITH SINGLE STRING TAG:", result);
if (!result.success) {
  console.log("ERRORS:", result.error.format());
}
