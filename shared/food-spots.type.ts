export type TagsDTO = 'BREAKFAST' | 'TIFFIN'  | 'NON_VEG'  | 'VEG'  | 'SNACKS'  | 'LATE_NIGHT'  | 'HOME_STYLE'  | 'BUDGET'  | 'NORTH_INDIAN'  | 'SOUTH_INDIAN';

export type SpotRatingDTO =  'ONESTAR' | 'TWOSTAR' | 'THREESTAR' | 'FOURSTAR' | 'FIVESTAR';

export type VerificationStatusDTO =  'PENDING' | 'VERIFIED' | 'REJECTED';

export interface FoodSpotDTO {
  id?: string;
  name: string;
  location: {
    locality: string;
    town?: string | null;
    city: string;
    state: string;
  };
  spotRating?: SpotRatingDTO;  
  tags?: TagsDTO[];            
  imageUrl?: string;
  status?: VerificationStatusDTO;  
  userid?: string;
  createAt?: string;
}

export interface GetFoodSpotsProps {
  search?: string;
  tags?: TagsDTO[];
  rating?: SpotRatingDTO;
  page: number;
  limit: number;
}

export interface GetUserSubmissionsProps extends GetFoodSpotsProps {
  userId: string;
}

