import { SpotRatingDTO, TagsDTO } from "../../shared/food-spots.type";
import { api } from "./axios";

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









