


export type TagsDTO = {
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


export type SpotRatingDTO = {
  ONESTAR: "ONESTAR",
  TWOSTAR: "TWOSTAR",
  THREESTAR: "THREESTAR",
  FOURSTAR: "FOURSTAR",
  FIVESTAR: "FIVESTAR",
} 


export type VerificationStatusDTO = {
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED'
}


export interface FoodSpotDTO {
  id?:string
  name: string;
  location: {
    locality: string;
    town?: string | null;
    city: string;
    state: string;
  };
  spotRating?: SpotRatingDTO;
  tags?: TagsDTO[];
  imageUrl?:string
  status?:VerificationStatusDTO
  userid?:string;
  createAt?:string;
}

export interface GetFoodSpotsProps {
  search?:string;
  tags?:TagsDTO[];
  rating?:SpotRatingDTO;
  page:number;
  limit:number;
}

export interface GetUserSubmissionsProps extends GetFoodSpotsProps{
  userId:string;
}


