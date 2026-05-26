import {type User} from '../lib/auth'

export interface FoodSpots{
  id : string
  user : User
  name : string 
  location : string
  spotRating : SpotRating
  tags : Tags
}

enum Tags{
  TIFFIN,
  NON_VEG,
  VEG,
  SNACKS,
  LATE_NIGHT,
  HOME_STYLE,
  BUDGET,
  NORTH_INDIAN,
  SOUTH_INDIAN,
}

enum SpotRating{
  ONESTAR,
  TWOSTAR,
  THREESTAR,
  FOURSTAR,
  FIVESTAR,
}


