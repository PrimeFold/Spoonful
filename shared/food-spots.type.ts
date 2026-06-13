

export type VerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";
export type SpotRating  = "ONESTAR" | "TWOSTAR" | "THREESTAR" | "FOURSTAR" | "FIVESTAR";
export type Tags = "BREAKFAST" | "TIFFIN" | "NON_VEG" | "VEG" | "SNACKS" | "LATE_NIGHT" | "HOME_STYLE" | "BUDGET" | "NORTH_INDIAN" | "SOUTH_INDIAN";


export interface FoodSpotDTO {
  id?:string
  name: string;
  location: {
    locality: string;
    town?: string | null;
    city: string;
    state: string;
  };
  spotRating?: SpotRating;
  tags?: Tags[];
  imageUrl?:string
  status?:VerificationStatus
  userid?:string;
  createAt?:string;
}

export interface GetFoodSpotsProps {
  search?:string;
  tags?:Tags[];
  rating?:SpotRating;
  page:number;
  limit:number;
}

export interface GetUserSubmissionsProps extends GetFoodSpotsProps{
  userId:string;
}

export const TagsDTO = {
  TIFFIN: "TIFFIN",
  NON_VEG: "NON_VEG",
  VEG: "VEG",
  SNACKS: "SNACKS",
  LATE_NIGHT: "LATE_NIGHT",
  HOME_STYLE: "HOME_STYLE",
  BUDGET: "BUDGET",
  NORTH_INDIAN: "NORTH_INDIAN",
  SOUTH_INDIAN: "SOUTH_INDIAN",
} 


export const SpotRatingDTO = {
  ONESTAR: "ONESTAR",
  TWOSTAR: "TWOSTAR",
  THREESTAR: "THREESTAR",
  FOURSTAR: "FOURSTAR",
  FIVESTAR: "FIVESTAR",
} 


export const VerificationStatusDTO = {
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED'
}



