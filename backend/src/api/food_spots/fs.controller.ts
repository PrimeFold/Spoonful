import * as FoodSpotService from "./fs.service";
import type { Handler } from "../../types";
import { AddFoodSpotsSchema, GetFoodSpotsSchema } from "../../lib/zod";

export const AddFoodSpotController: Handler = async (
  req,
  res
) => {
  console.log("AddFoodSpotController triggered")
  console.log("Request body:", JSON.stringify(req.body, null, 2))
  const  data  = req.body;
  const result = AddFoodSpotsSchema.safeParse(data);
  if(!result.success){
    return res.status(400).json({
      success:false,
      message:"Invalid input data",
      data:null
    })
  }
  const userId = req.user?.id;

  if (!userId) {
    return res.status(403).json({
      success: false,
      message: "Forbidden Access",
    });
  }

  try {
    const response = await FoodSpotService.AddFoodSpotService( userId, result.data );
    console.log(response.success)
    if (!response.success) {
      console.log(response.message)
      return res.status(400).json(response.message);
    }

    return res.status(201).json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        (error as Error).message ??
        "Internal Server Error",
    });
  }
};

export const getAllFoodSpotsController: Handler = async (req, res) => {
    
    const validated = GetFoodSpotsSchema.safeParse(req.query);

    if (!validated.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid query parameters",
        data: null,
      });
    }

    try {
      const response =  await FoodSpotService.getAllFoodSpots(  validated.data  );

      if (!response.success) {
        return res.status(400).json(response);
      }

      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          (error as Error).message ??
          "Internal Server Error",
      });
    }
  };

export const assignRatingController: Handler =
  async (req, res) => {
    const { spotId, rating } = req.body;

    try {
      const response =
        await FoodSpotService.AssignRating(
          rating,
          spotId
        );

      if (!response.success) {
        return res.status(400).json(response);
      }

      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          (error as Error).message ??
          "Internal Server Error",
      });
    }
  };

export const getFoodSpotById: Handler = async (  req ,  res ) => {
  const { id } = req.params;

  if (!id && id?.length!==0) {
    return res.status(400).json({
      success: false,
      message: "Spot ID is required",
      data: null,
    });
  }

  try {
    const response = await FoodSpotService.GetFoodSpotById(id as string);

    if (!response.success) {
      return res.status(404).json(response);
    }

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        (error as Error).message ??
        "Internal Server Error",
    });
  }
};

export const getFoodSpotsByUserIdController: Handler =
  async (req, res) => {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden Access",
      });
    }

    const validated =
      GetFoodSpotsSchema.safeParse(req.query);

    if (!validated.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid query parameters",
        data: null,
      });
    }

    try {
      const response =
        await FoodSpotService.GetUserSubmissions({
          ...validated.data,
          userId,
        });

      if (!response.success) {
        return res.status(400).json(response);
      }

      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          (error as Error).message ??
          "Internal Server Error",
      });
    }
  };