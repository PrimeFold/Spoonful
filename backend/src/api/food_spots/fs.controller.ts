import { Request, Response } from 'express';
import * as FoodSpotService from './fs.service'

interface Handler {
    req: Request,
    res: Response
}

export const AddFoodSpotController = async({ req, res }: Handler) => {
    const { userId , data } = req.body;
    try {
        const newSpot = await FoodSpotService.AddFoodSpotService(userId,data);
        if(!newSpot.success){
            return res.status(400).json({message:newSpot.message});
        }
        return res.status(201).json({
            message:newSpot.message,
            data:newSpot.data
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: (error as Error).message || 'Internal Server Error'
        });
    }
}

export const getAllFoodSpotsController = async({ req, res }: Handler) => {
    const {search,tags,rating} = req.body;

    try {
        const AllFoodSpots = await FoodSpotService.getAllFoodSpots({search,tags,rating});
        if(!AllFoodSpots.success){
            return res.status(400).json({message:AllFoodSpots.message})
        }
        return res.status(200).json({
            message:AllFoodSpots.message,
            data:AllFoodSpots.data
        });
    } catch (error) {
       return res.status(500).json({
            success: false,
            message: (error as Error).message || 'Internal Server Error'
       });
    }


}


export const assignRatingController = async({req,res}:Handler)=>{
    const {spotId,rating} = req.body;

    try {
        const spot = await FoodSpotService.assignRating(rating,spotId);
        if(!spot.success){
            return res.status(400).json({
                message:spot.message
            })
        }
        return res.status(201).json({
            message:spot.message,
            data:spot.data
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: (error as Error).message || 'Internal Server Error'
        });
    }

}

