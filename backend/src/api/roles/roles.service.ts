
//ADMIN FUNCTIONS

import type { VerificationStatus } from "../../generated/prisma/enums";
import { FoodSpotRepository } from "../food_spots/fs.repository";
import { RolesRepository } from "./roles.repository";
import { PaginationSchema, GetManagedUsersSchema } from "../../lib/zod";
import type { ApiResponse, PaginatedResponse } from "../../types/api.types";
import type { ManagedUserDTO } from "../../../../shared/roles.type";
import type { FoodSpotDTO } from "../../../../shared/food-spots.type";
import { foodSpotToDTO } from "../../mapper/fs.mapper";
import { redis } from "../../lib/redis";
import { generatePendingSpotsKey } from "../../utils/cacheKey";

export const GetPendingFoodSpotsService = async({
  page,
  limit,
}: {
  page: number;
  limit: number;
}): Promise<ApiResponse<PaginatedResponse<FoodSpotDTO>>> => {
  const validated = PaginationSchema.safeParse({ page, limit });

  if (!validated.success) {
    return {
      success: false,
      message: "Invalid input",
      data: null,
    };
  }

  try {
    const skip = (page - 1) * limit;
    const cacheKey = generatePendingSpotsKey(page, limit);
    const cached = await redis.get(cacheKey);

    if (cached) {
      return {
        success: true,
        message: "CACHE HIT",
        data: JSON.parse(cached),
      };
    }

    const [spots, total] = await Promise.all([
      FoodSpotRepository.findPendingSpotsPaginated(skip, limit),
      FoodSpotRepository.countPendingSpots(),
    ]);

    const items = spots.map((spot) => foodSpotToDTO(spot));

    const response = {
      success: true,
      message: items.length === 0 ? "No pending spots as of current.." : "Pending spots found !",
      data: {
        items,
        pagination: {
          page,
          limit,
          total,
          hasMore: skip + items.length < total,
        },
      },
    };

    await redis.setex(cacheKey, 15, JSON.stringify(response.data));

    return response;
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
      data: null,
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

    const keys = await redis.keys("pending-food-spots:*");
    if (keys.length > 0) {
      await redis.del(...keys);
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
    if(admins.length===0){
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

export const GetAllStudentsService = async({
  page,
  limit,
  search,
}: {
  page: number;
  limit: number;
  search?: string;
}): Promise<ApiResponse<PaginatedResponse<ManagedUserDTO>>> => {
  const validated = GetManagedUsersSchema.safeParse({ page, limit, search });

  if (!validated.success) {
    return {
      success: false,
      message: "Invalid input",
      data: null,
    };
  }

  try {
    const skip = (page - 1) * limit;
    const { students, total } = await RolesRepository.GetAllStudents(
      skip,
      limit,
      search
    );

    return {
      success: true,
      message: students.length === 0 ? "No students found" : "Students fetched",
      data: {
        items: students,
        pagination: {
          page,
          limit,
          total,
          hasMore: skip + students.length < total,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message ?? "Internal Server Error",
      data: null,
    };
  }
};

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

export const DemoteToStudentService = async(userId: string) => {
  try {
    const student = await RolesRepository.DemoteToStudent(userId);
    if (!student) {
      return {
        success: false,
        message: "Couldn't find user",
        data: null,
      };
    }

    return {
      success: true,
      message: `User: ${userId} demoted to Student..`,
      data: student,
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message ?? "Internal Server Error",
      data: null,
    };
  }
};
