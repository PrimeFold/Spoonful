import type { SpotRating, Tags } from "../../backend/src/generated/prisma/enums";
import { api } from "./axios"

export const getAllFoodSpots = async({search,tags,rating,page,limit}:{search?:string ,tags?:Tags[],rating?:SpotRating,page?:number,limit:number})=>{
    const { data } = await api.get('/app/get-food-spots',{ params: { search, tags, rating, page, limit } });
    return data;
}

export const getFoodSpotById = async(id:string)=>{
    const {data} = await api.get(`/app/get-food-spot/${id}`)
    return data;
}   
