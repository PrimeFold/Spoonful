import {prisma} from "../../lib/auth/auth"
import { SpotRating,Tags } from "../../generated/prisma/enums";
import {redis} from '../../lib/redis'
interface AddFoodSpotInput {
  spotName: string;
  spotRating: SpotRating;
  tags: Tags[];
  location: string;
}

interface GetFoodSpotsFilters {
  search?: string;
  tags?: Tags[];
  rating?: SpotRating;
}

export const AddFoodSpotService = async (  userId:string,  data: AddFoodSpotInput ) => {
  try {

    const exists = await prisma.foodSpots.findFirst({
      where:{
        name:data.spotName,
        location: data.location,
      }
    })

    if(exists){
      return {
        success:false,
        message:"Food spot already exists !"
      }
    }

    const foodSpot = await prisma.foodSpots.create({
      data: {
        userId: userId,
        name: data.spotName,
        spotRating: data.spotRating,
        tags: data.tags,
        location: data.location,
      },
    });
  
    if(!foodSpot) {
      return {
        success:false,
        message:"Couldn't add food spot"
      }
    }

    return {
      success:true,
      message:"Food spot added successfully!",
      data:foodSpot
    }

  } catch (error) {
    return{
      success:false,
      message:(error as Error).message
    }
  }
};

export const getAllFoodSpots = async({search,tags,rating}:GetFoodSpotsFilters)=>{
  try {
    const cacheKey = `all-food-spots:${search || ''}:${tags?.join(',') || ''}:${rating || ''}`;
    const cache = await redis.get(cacheKey);

    if(cache){
      const data = JSON.parse(cache);
      return{
        success:true,
        message:"Cache found!",
        data:data
      }
    }

    const foodSpots = await prisma.foodSpots.findMany({
      where:{...(search && {
        name:{
          contains:search,
          mode:"insensitive"
        }
      }),
      ...(tags && tags.length>0 && {
        tags:{
          hasEvery:tags
        }
      }),
      ...(rating && {
        spotRating:rating
      })
    },
      select:{
        id:true,
        name:true,
        userId:true,
        location:true,
        tags:true,
        spotRating:true
    }});

    await redis.setex(cacheKey, 10 * 60, JSON.stringify(foodSpots));

    if(!foodSpots){
      return{
        success:false,
        message:"Couldn't fetch food spots"
      }
    }
    
    if(foodSpots.length==0){
      return{
        success:true,
        message:"No food spots found ",
        data:[]
      }
    }

    return {
      success:true,
      message:"Fetched food spots successfully!",
      data:foodSpots
    }
  } catch (error) {
    return{
      success:false,
      message:(error as Error).message
    }
  }
}


export const assignRating = async(rating:SpotRating,id:string)=>{
  try {
    const foundSpot = await prisma.foodSpots.findFirst({where:{id:id}})

    if(!foundSpot){
      return {
        success:false,
        message:"Not found.."
      }
    }

    const spot = await prisma.foodSpots.update({
      where:{
        id:id
      },
      data:{
        spotRating:rating
      },
      select:{
        id:true,
        name:true,
        userId:true,
        location:true,
        tags:true,
        spotRating:true
      }
    })

    if(!spot){
      return{
        success:true,
        message:"Couldn't assign rating.."
      }
    }

    return{
      success:true,
      message:"rating assigned successfully",
      data:spot
    }
  } catch (error) {
    return{
      success:false,
      message:"Internal Server Error"
    }
  }
}


export const getFoodSpotById = async(spotId:string)=>{
  try {
    const exists = await prisma.foodSpots.findFirst({
      where:{
        id:spotId
      },
      select:{
        id:true,
        name:true,
        userId:true,
        location:true,
        tags:true,
        spotRating:true
      }
    })

    if(!exists){
      return {
        success:false,
        message:"Food spot does NOT exist"
      }
    }
    return{
      success:true,
      message:"Food spot found!",
      data:exists
    }
  } catch (error) {
    return {
        success:false,
        message:(error as Error).message
    }
  }
}

