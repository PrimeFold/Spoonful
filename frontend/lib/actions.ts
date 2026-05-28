import { api } from "./axios"

export const getAllFoodSpots = async()=>{
    const { data } = await api.get('/app/get-food-spots');
    return data;
}

export const getFoodSpotById = async(id:string)=>{
    const {data} = await api.get(`/app/get-food-spot/${id}`)
    return data;
}   
