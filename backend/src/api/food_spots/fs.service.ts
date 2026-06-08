import {  type FoodSpotDTO } from "../../../../shared/food-spots.type";
import type { SpotRating, Tags, VerificationStatus } from "../../generated/prisma/client";
import { buildFoodSpotFilters, buildUserSubmissionsFilters } from "../../lib/filter";
import { redis } from "../../lib/redis";
import { GetFoodSpotsSchema, GetUserSubmissionsSchema } from "../../lib/zod";
import { foodSpotToDTO } from "../../mapper/fs.mapper";
import type { ApiResponse, PaginatedResponse } from "../../types/api.types";
import { generateAllSpotsKey, generateUserSpotsKey } from "../../utils/cacheKey";
import { FoodSpotRepository, UserRepository } from "./fs.repository";
import type { GetFoodSpotsProps, GetUserSubmissionsProps } from "../../../../shared/food-spots.type";

export const AddFoodSpotService = async (  userId: string ,  data: FoodSpotDTO ): Promise<ApiResponse<FoodSpotDTO>> => {
  try {
   
    let location = await FoodSpotRepository.findLocation( data.location.locality , data.location.city , data.location.state , data.location.town);
    if (!location) {
      location = await FoodSpotRepository.createLocation({
            locality: data.location.locality,
            town: data.location.town,
            city: data.location.city,
            state: data.location.state,
      });
    }

    const duplicate = await FoodSpotRepository.findDuplicate(  data.name.trim() ,  location.id );

    if (duplicate) {
      return {
        success: false,
        message: "Food spot already exists",
        data: null,
      };
    }


    const foodSpot = await FoodSpotRepository.create(
      {
        name: data.name.trim(),
        spotRating: data.spotRating!,
        tags: data.tags,
        user: {
          connect: {
            id: userId,
          },
        },

        location: {
          connect: {
            id: location.id,
          },
        },
      });

    return {
      success: true,
      message: "Food spot added successfully",
      data:foodSpot,
    };

  } catch (error) {

    return {
      success: false,
      message: (error as Error).message,
      data: null,
    };
  }
};

export const getAllFoodSpots = async({search,tags,rating, page,limit}:GetFoodSpotsProps):Promise<ApiResponse<PaginatedResponse<FoodSpotDTO>>> =>{
  
  const validated = GetFoodSpotsSchema.safeParse({search,tags,rating,page,limit});

  if(!validated.success){
    return{
      success:false,
      message:"Invalid input",
      data:null
    }
  }

  try {
    const cacheKey = generateAllSpotsKey(search ?? "" , tags ?? [] , rating, page , limit);
    const cache = await redis.get(cacheKey);


    if(cache){
      const data = JSON.parse(cache);
      return{
        success:true,
        message:"CACHE HIT",
        data
      }
    }

    const skip = (page-1)*limit;

    const where = buildFoodSpotFilters({search,tags,rating});
    
    const[spots,total] = await Promise.all([FoodSpotRepository.findMany(where,skip,limit),FoodSpotRepository.count(where)]);

    const items = spots.map(foodSpotToDTO);

    const result : PaginatedResponse<FoodSpotDTO> = {
      items,
      pagination:{
        page,
        limit,
        total,    
        hasMore : skip + spots.length < total,
      },
    }

    await redis.setex(cacheKey,600,JSON.stringify(result));

    return {
      success: true,
      message: "Food spots fetched successfully",
      data: result,
    };

  } catch (error) {
     return {
      success: false,
      message: (error as Error).message,
      data: null,
    };
  }
}

export const GetUserSubmissions = async({userId,search,tags,rating,page,limit}:GetUserSubmissionsProps)=>{
  const validated =  GetUserSubmissionsSchema.safeParse({userId,search,tags,rating,page,limit});
  if(!validated.success && !validated.data){
    return{
      sucess:false,
      message:"Invalid input",
      data:null
    }
  }
  const cacheKey = generateUserSpotsKey(userId,search ?? "", tags ?? [], rating ?? undefined , page , limit )
  try {
    const cache = await redis.get(cacheKey);
    if(cache){
      const data = JSON.parse(cache);
      return{
        success:true,
        message:"CACHE HIT",
        data
      }
    }

    const skip = (page-1)*limit;

    const where = buildUserSubmissionsFilters({search,tags,rating,userId});

    const[spots,total] = await Promise.all([FoodSpotRepository.findMany(where,skip,limit),FoodSpotRepository.count(where)]);
    const items = spots.map(foodSpotToDTO);

     const result : PaginatedResponse<FoodSpotDTO> = {
      items,
      pagination:{
        page,
        limit,
        total,    
        hasMore : skip + spots.length < total,
      },
    }

    await redis.setex(cacheKey,300,JSON.stringify(result));

    return {
      success: true,
      message: "Food spots fetched successfully",
      data: result,
    }

  } catch (error) {
    return{
      success:false,
      message:(error as Error).message,
      data:null
    }
  }
}


export const GetFoodSpotById = async(spotId:string)=>{
  try {
    const spot = await FoodSpotRepository.findById(spotId);
    if(!spot){
      return{
        success:false,
        message:"Spot not found!",
        data:null
      }
    }
    return{
      success:true,
      message:"Spot found!",
      data:spot
    }

  } catch (error) {
    return{
      success:false,
      message:(error as Error).message || "Internal Server Error",      
      data:null
    }
  }
}

export const AssignRating = async(rating:SpotRating,spotId:string)=>{
  try {
    const res = await FoodSpotRepository.updateRating(spotId,rating);
    if(!res){
      return{
        success:false,
        message:"Couldn't assign rating due to unknown reasons",
        data:null
      }
    }
    return{
      success:true,
      message:"rating assigned!",
      data:res
    }

  } catch (error) {
    return{
      success:false,
      message:(error as Error).message || " Internal Server Error",
      data:null
    }
  }
}
