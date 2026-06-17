import * as RoleService from '../roles/roles.service'
import { GetFoodSpotById } from '../food_spots/fs.service';
import { GetManagedUsersSchema, PaginationSchema, VerifyPendingSpotSchema } from "../../lib/zod";
import type { Handler } from "../../types";

export const GetPendingFoodSpotsController : Handler= async(req,res)=>{
  const validated = PaginationSchema.safeParse(req.query);
  if (!validated.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid query parameters",
      data: null,
    });
  }

  try {
    const response = await RoleService.GetPendingFoodSpotsService(validated.data);
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

export const GetPendingFoodSpotController : Handler = async(req,res)=>{
  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  if (!id) {
    return res.status(400).json({
      success:false,
      message:"Spot id is required",
      data:null
    });
  }
  try {
    const response = await GetFoodSpotById(id);
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
    const rawId = req.params.id;
    const spotId = (Array.isArray(rawId) ? rawId[0] : rawId) ?? result.data.spotId;
    const adminId = req.user?.id;
    const response = await RoleService.VerifyPendingSpotService(spotId,result.data.status, adminId);
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

export const GetAllStudentsController : Handler = async(req,res)=>{
  const validated = GetManagedUsersSchema.safeParse(req.query);
  if (!validated.success) {
    return res.status(400).json({
      success:false,
      message:"Invalid query parameters",
      data:null
    })
  }

  try {
    const response = await RoleService.GetAllStudentsService(validated.data);
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
  const {userId} = req.body;
  if (!userId) {
    return res.status(400).json({
      success:false,
      message:"User id is required",
      data:null
    })
  }
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

export const DemoteToStudentController: Handler = async(req,res)=>{
  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  if (!id) {
    return res.status(400).json({
      success:false,
      message:"User id is required",
      data:null
    });
  }

  try {
    const response = await RoleService.DemoteToStudentService(id);
    if (!response.success) {
      return res.status(400).json(response);
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:(error as Error).message ?? "Internal Server Error"
    });
  }
}

export const GetSubmissionStatsController: Handler = async (req, res) => {
  try {
    const response = await RoleService.GetSubmissionStatsService();
    if (!response.success) {
      return res.status(400).json(response);
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: (error as Error).message || "Internal Server Error",
    });
  }
};

export const GetAdminActionsController: Handler = async (req, res) => {
  try {
    const response = await RoleService.GetAdminActionsService();
    if (!response.success) {
      return res.status(400).json(response);
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: (error as Error).message || "Internal Server Error",
    });
  }
};

export const GetSubmittedSpotsController: Handler = async (req, res) => {
  try {
    const page = parseInt(req.query.page as string || "1");
    const limit = parseInt(req.query.limit as string || "10");
    const search = req.query.search as string || undefined;

    const response = await RoleService.GetSubmittedSpotsService({ page, limit, search });
    if (!response.success) {
      return res.status(400).json(response);
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: (error as Error).message || "Internal Server Error",
    });
  }
};







