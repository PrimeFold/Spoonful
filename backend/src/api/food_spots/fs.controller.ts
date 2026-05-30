import * as FoodSpotService from './fs.service'
import type { Handler } from '../../types';
import { GetFoodSpotsSchema } from '../../lib/zod';


export const AddFoodSpotController : Handler =  async(req,res) => {
    const { data } = req.body;
    
    const userId = req.user!.id || null;
    if(!userId){
        res.status(403).json({
            message:"Forbidden Access"
        })
    }
    
    try {
        const response = await FoodSpotService.AddFoodSpotService(userId as string,data);
        if(!response.success){
            return res.status(400).json({message:response.message});
        }
        return res.status(201).json({
            message:response.message,
            data:response.data
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: (error as Error).message || 'Internal Server Error'
        });
    }
}

export const getAllFoodSpotsController : Handler = async(req,res) => {

    const validated = GetFoodSpotsSchema.safeParse(req.query);

    if(!validated.success){
        return res.status(400).json({
            success:false,
            message:"Invalid",
            data:null
        })
    }

    console.log(validated.data);
    
    const { search , tags , rating , page , limit} = validated.data;
    
    try {
        const response = await FoodSpotService.getAllFoodSpots({search,tags,rating,limit,page});
        if(!response.success){
            return res.status(400).json({message:response.message})
        }
        return res.status(200).json({
            message:response.message,
            data:response.data
        });
    } catch (error) {
       return res.status(500).json({
            success: false,
            message: (error as Error).message || 'Internal Server Error'
       });
    }


}


export const assignRatingController : Handler = async(req,res)=>{
    const {spotId,rating} = req.body;

    try {
        const response = await FoodSpotService.assignRating(rating,spotId);
        if(!response.success){
            return res.status(400).json({
                message:response.message
            })
        }
        return res.status(201).json({
            message:response.message,
            data:response.data
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: (error as Error).message || 'Internal Server Error'
        });
    }

}


export const getFoodSpotById : Handler = async(req,res)=>{
    const spotId = req.params.id;
    if(!spotId){
        return res.status(404).json({
            message:"Spot not found in url params"
        })
    }

    try {
        const response = await FoodSpotService.getFoodSpotById(spotId as string);
        if(!response.success){
            return res.status(400).json({
                message:response.message
            })
        }
        return res.status(200).json({
            message:response.message,
            data:response.data
        })
    } catch (error) {
        return res.status(500).json({
            message:(error as Error).message
        })
    }


}
