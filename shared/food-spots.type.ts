import {SpotRating,Tags} from '../backend/src/generated/prisma/client'

export interface FoodSpotDTO {
  id: string;
  name: string;
  location: string;
  spotRating: SpotRating;
  tags: Tags[];
  imageUrl?:string;
}
export const TagsDTO = {
  TIFFIN: 'TIFFIN',
  NON_VEG: 'NON_VEG',
  VEG: 'VEG',
  SNACKS: 'SNACKS',
  LATE_NIGHT: 'LATE_NIGHT',
  HOME_STYLE: 'HOME_STYLE',
  BUDGET: 'BUDGET',
  NORTH_INDIAN: 'NORTH_INDIAN',
  SOUTH_INDIAN: 'SOUTH_INDIAN'
} as const

export type TagsDTO = (typeof Tags)[keyof typeof Tags]


export const SpotRatingDTO = {
  ONESTAR: 'ONESTAR',
  TWOSTAR: 'TWOSTAR',
  THREESTAR: 'THREESTAR',
  FOURSTAR: 'FOURSTAR',
  FIVESTAR: 'FIVESTAR'
} as const

export type SpotRatingDTO = (typeof SpotRating)[keyof typeof SpotRating]