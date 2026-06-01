import {prisma} from "../../lib/auth/auth"
import { SpotRating,Tags } from "../../generated/prisma/enums";
import {redis} from '../../lib/redis'
import type { ApiResponse, PaginatedResponse } from "../../types/api.types";
import type { FoodSpotDTO } from '../../../../shared/food-spots.type'
import { Prisma } from "../../generated/prisma/client";
import bcrypt from 'bcrypt';

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
  limit:number;
  page:number;
}

interface GetUserFoodSpotsFilters{
  userId:string;
  search?: string;
  tags?: Tags[];
  rating?: SpotRating;
  limit:number;
  page:number;
}



export const AddFoodSpotService  = async (  userId:string,  data: AddFoodSpotInput ): Promise<ApiResponse<FoodSpotDTO>> => {
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
        message:"Food spot already exists !",
        data:null
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
        message:"Couldn't add food spot",
        data:null
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
      message:(error as Error).message,
      data:null
    }

  }
};

export const getAllFoodSpots = async({search,tags,rating,limit,page}:GetFoodSpotsFilters) : Promise<ApiResponse<PaginatedResponse<FoodSpotDTO>>> =>{
  try {
    const normalizedTags = tags?.slice().sort().join(",") || "";
    const normalizedSearch = search?.trim().toLowerCase() || "";
    const normalizedRating = rating || "";
    const cacheKey = `all-food-spots:${normalizedSearch}:${normalizedTags}:${normalizedRating}:${page}:${limit}`;
    const cache = await redis.get(cacheKey);

    if(cache){
      const data = JSON.parse(cache);
      return{
        success:true,
        message:"Cache found!",
        data:data
      }
    }
    const skip = (page - 1) * limit;

    
    const whereClause : Prisma.FoodSpotsWhereInput = {
      ...(search && {
        name: {
          contains: search,
          mode: "insensitive"
        }
      }),
    
      ...(tags && tags.length > 0 && {
        tags: {
          hasEvery: tags
        }
      }),
    
      ...(rating && {
        spotRating: rating
      })
    }

    const foodSpots = await prisma.foodSpots.findMany({
      where:whereClause,
      skip,
      take:limit,
      select:{
        id:true,
        name:true,
        userId:true,
        location:true,
        tags:true,
        spotRating:true
    }});

    
    
    const total = await prisma.foodSpots.count({
      where:whereClause
    });
    const hasMore = skip + foodSpots.length < total;
    
    await redis.setex(cacheKey, 10 * 60, JSON.stringify(foodSpots));

    return {
      success:true,
      message:"Fetched food spots successfully!",
      data:{
         items: foodSpots,
          pagination: {
            page,
            limit,
            total,
            hasMore
          }
      }
    }
  } catch (error) {
    return{
      success:false,
      message:(error as Error).message,
      data:null
    }
  }
}


export const assignRating = async(rating:SpotRating,spotId:string):Promise<ApiResponse<FoodSpotDTO>>=>{
  try {
    const foundSpot = await prisma.foodSpots.findUnique({where:{id:spotId}})

    if(!foundSpot){
      return {
        success:false,
        message:"Not found..",
        data:null
      }
    }

    const spot = await prisma.foodSpots.update({
      where:{
        id:spotId
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
        message:"Couldn't assign rating..",
        data:null
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
      message:"Internal Server Error",
      data:null
    }
  }
}


export const getFoodSpotById = async(spotId:string):Promise<ApiResponse<FoodSpotDTO>>=>{
  try {
    const exists = await prisma.foodSpots.findUnique({
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
        message:"Food spot does NOT exist",
        data:null
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
        message:(error as Error).message,
        data:null
    }
  }
}


export const getFoodSpotsByUserIdService = async({search,tags,rating,limit,page,userId}:GetUserFoodSpotsFilters):Promise<ApiResponse<PaginatedResponse<FoodSpotDTO>>>=>{
  try {

    const normalizedTags = tags?.slice().sort().join(",") || "";
    const normalizedSearch = search?.trim().toLowerCase() || "";
    const normalizedRating = rating || "";

    const userIdHash = await bcrypt.hash(userId,12);

    const cacheKey = `my-submissions:${normalizedSearch}:${normalizedTags}:${normalizedRating}:${page}:${userIdHash}`

    const cache = await redis.get(cacheKey);
  
    if(cache && cache.length!=0){
      const data = JSON.parse(cache);
      return{
        success:true,
        message:"Cache found!",
        data:data
      }
    }


    const whereClause : Prisma.FoodSpotsWhereInput = {
      ...(search && {
        name: {
          contains: search,
          mode: "insensitive"
        }
      }),
    
      ...(tags && tags.length > 0 && {
        tags: {
          hasEvery: tags
        }
      }),
    
      ...(rating && {
        spotRating: rating
      })
    }

    const skip = (page - 1)*limit;

    const foundSpots = await prisma.foodSpots.findMany({where:whereClause,skip,take:limit,select:{
       id:true,
        name:true,
        userId:true,
        location:true,
        tags:true,
        spotRating:true
    }})

    if(!foundSpots || foundSpots.length==0){
      return {
        success:true,
        message:"No submissions found",
        data:null
      }
    }

    const total = await prisma.foodSpots.count({where:whereClause});

    const hasMore = skip + foundSpots.length < total;
    
    await redis.setex(cacheKey,3 * 60, JSON.stringify(foundSpots));

    return{
      success:true,
      message:"User submissions found",
      data:{
         items: foundSpots,
          pagination: {
            page,
            limit,
            total,
            hasMore
          }
      }
    }
    
  } catch (error) {
    return{
      success:false,
      message:(error as Error).message,
      data:null
    }
  }
}
