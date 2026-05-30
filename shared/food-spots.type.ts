import {SpotRating,Tags} from '../backend/src/generated/prisma/client'

export interface FoodSpotDTO {
  id: string;
  name: string;
  location: string;
  spotRating: SpotRating;
  tags: Tags[];
}
