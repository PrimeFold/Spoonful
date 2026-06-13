import type { FoodSpotDTO } from "../../../shared/food-spots.type";
import type { SpotRating, Tags } from "../generated/prisma/client";


export const foodSpotToDTO = (spot: {
  id: string;
  name: string;
  userId: string;
  location: {
    locality: string;
    town?: string | null;
    city: string;
    state: string;
  } | null;
  spotRating: SpotRating;
  tags: Tags[];
  status?: import("../generated/prisma/client").VerificationStatus;
  createdAt?: Date;
}): FoodSpotDTO => ({
  id: spot.id,
  name: spot.name,
  location:
    spot.location ?? {
      locality: "Unknown",
      town: null,
      city: "Unknown",
      state: "Unknown",
    },
  spotRating: spot.spotRating,
  tags: spot.tags,
  status: spot.status,
  userid: spot.userId,
  createAt: spot.createdAt?.toISOString(),
});
