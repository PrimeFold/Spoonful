
//ADMIN FUNCTIONS
import * as RoleService from '../roles/roles.service'
import { VerifyPendingSpotSchema } from "../../lib/zod";
import type { Handler } from "../../types";

export const GetPendingFoodSpotsController : Handler= async(req,res)=>{
  try {
    const response = await RoleService.GetPendingFoodSpotsService();
    if(!response.success){
      return res.status(400).json(response);
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:(error as Error).message ?? "Internal Server Error"
    })
  }
}

export const VerifyPendingSpotController:Handler = async(req,res)=>{
  const result = VerifyPendingSpotSchema.safeParse(req.body);

  if(!result.success){
    return res.status(400).json({
      message:"Invalid Input"
    })
  }
  try {
    const response = await RoleService.VerifyPendingSpotService(result.data.spotId,result.data.status);
    if(!response.success){
      return res.status(400).json(response)
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:(error as Error).message ?? "Internal Server Error"
    });
  }
}

export const GetAllAdminsController : Handler = async(req,res)=>{
  try {
    const response = await RoleService.GetAllAdminsService()
    if(!response.success){
      return res.status(400).json(response)
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:(error as Error).message ?? "Internal Server Error"
    });
  }
}


export const PromoteToAdminController : Handler = async(req,res)=>{
    const{userId} = req.body;
  try {
    const response = await RoleService.PromoteToAdminService(userId)
    if(!response.success){
        return res.status(400).json(response)
    }
    return res.status(201).json(response)
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:(error as Error).message ?? "Internal Server Error"
    });
  }
}







