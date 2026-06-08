
//ADMIN FUNCTIONS

import type { VerificationStatus } from "../../generated/prisma/enums";
import { FoodSpotRepository } from "../food_spots/fs.repository";
import { RolesRepository } from "./roles.repository";

export const GetPendingFoodSpotsService = async()=>{
  try {
    const spots = await FoodSpotRepository.findPendingSpots();

    if( !spots || spots.length==0){
      return {
        success:true,
        message:"No pending spots as of current..",
        data:spots
      }
    }

    return{
      success:true,
      message:"Pending spots found !",
      data:spots
    }
  } catch (error) {
    return {
      success:false,
      message:(error as Error).message,
      data:null
    }
  }
}


export const VerifyPendingSpotService = async(spotId:string,status:VerificationStatus)=>{
  try {
    const spot =  await FoodSpotRepository.verifyPendingSpot(spotId,status);
    if(!spot){
      return {
        success:false,
        message:"Couldn't verify the spot",
        data:null
      }
    }

    return {
      success:true,
      message:"Verified Pending Spot",
      data:null
    }
  } catch (error) {
    return {
        success:false,
        message:(error as Error).message ?? "Internal Server Error",
        data:null
      }
  }
}


export const GetAllAdminsService = async()=>{
  try {
    const admins = await RolesRepository.GetAllAdmins();
    if(!admins){
      return {
        success:true,
        message:"No admins exist yet..",
        data:admins
      }
    }

    return{
      success:true,
      message:"Fetched admins",
      data:admins
    }
  } catch (error) {
    return{
      success:false,
      message:(error as Error).message ?? "Internal Server Error",
      data:null
    }
  }
}

export const PromoteToAdminService = async(userId:string)=>{
  try {
    const admin = await RolesRepository.PromoteToAdmin(userId);
    if(!admin){
      return{
        success:false,
        message:"Couldn't find user",
        data:null
      }
    }

    return{
      success:true,
      message:`User: ${userId} promoted to Admin..`,
      data:admin
    }
  } catch (error) {
    return{
      success:false,
      message:(error as Error).message ?? "Internal Server Error",
      data:null
    }
  }
}