
import type { SpotRatingDTO, TagsDTO, VerificationStatusDTO } from "../../shared/food-spots.type";
import type { ApiResponse, GetManagedUsersProps, ManagedUsersResponse } from "../../shared/roles.type";
import { api } from "./axios";

interface Location{
    locality:string,
    town?:string,
    city:string,
    state:string
}

export const getAllFoodSpots = async({search,tags,rating,page,limit}:{search?:string ,tags?:TagsDTO[],rating?:SpotRatingDTO,page?:number,limit:number})=>{
    const params = {
        search,
        tags,
        rating,
        page,
        limit
    } as const;

    const cleanedParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => {
            if (value === undefined || value === null || value === '') return false;
            if (Array.isArray(value) && value.length === 0) return false;
            return true;
        })
    );

    const { data } = await api.get('/app/get-food-spots',{ params: cleanedParams });
    return data;
}

export const getFoodSpotById = async(id:string)=>{
    const {data} = await api.get(`/app/get-food-spot/${id}`)
    return data;
}   

export const getUserSubmissions = async({search,tags,rating,page,limit}:{search?:string ,tags?:TagsDTO[],rating?:SpotRatingDTO,page?:number,limit:number}) =>{
    const params = {
        search,
        tags,
        rating,
        page,
        limit
    } as const;
    
    const cleanedParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => {
            if (value === undefined || value === null || value === '') return false;
            if (Array.isArray(value) && value.length === 0) return false;
            return true;
        })
    );

    const {data} = await api.get('/app/my-food-spots',{params:cleanedParams});
    return data;
}

export const AddFoodSpot = async(name: string, location:Location, rating?: SpotRatingDTO, tags?: TagsDTO[]) => {
    const payload = {
        name, location,spotRating:rating, tags
    }
    const { data } = await api.post('/app/food-spot',payload);
    return data;
}


const cleanParams = <T extends Record<string, unknown>>(params: T) =>
  Object.fromEntries(
    Object.entries(params).filter(([_, value]) => {
      if (value === undefined || value === null || value === "") return false;
      if (Array.isArray(value) && value.length === 0) return false;
      return true;
    })
  );

export const GetPendingFoodSpots = async({page = 1, limit = 10}:{page?:number,limit?:number}={})=>{
    const {data} = await api.get('/admin/food-spots/pending',{params:cleanParams({page,limit})});
    return data;
}

export const VerifyPendingFoodSpots = async(id:string,status:VerificationStatusDTO)=>{
    const {data} = await api.patch(`/admin/food-spots/${id}/verify`,{spotId:id,status});
    return data;
}

export const GetPendingFoodSpotById = async(id:string)=>{
    const {data }= await api.get(`/admin/food-spots/${id}`);
    return data;
}

export const GetAllAdmins = async()=>{
    const {data} = await api.get('/owner/admins');
    return data;
}

export const GetAllStudents = async({page,limit,search}:GetManagedUsersProps):Promise<ApiResponse<ManagedUsersResponse>>=>{
    const {data} = await api.get('/owner/students',{params:cleanParams({page,limit,search})});
    return data;
}

export const PromoteToAdmin = async(userId:string)=>{
    const {data} = await api.post('/owner/admins',{userId});
    return data;
}

export const DemoteToStudent = async(userId:string)=>{
    const {data} = await api.patch(`/owner/admins/${userId}`);
    return data;
}


