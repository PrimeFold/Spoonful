import type { FoodSpotDTO } from "../../../../shared/food-spots.type";
import { foodSpotToDTO } from "../../mapper/fs.mapper";
import type { ApiResponse } from "../../types/api.types";
import { FoodSpotRepository } from "./fs.repository";


export const AddFoodSpotService = async (
  userId: string,
  data: FoodSpotDTO
): Promise<ApiResponse<FoodSpotDTO>> => {
  try {
    let location = await FoodSpotRepository.findLocation( data.location.locality , data.location.city , data.location.state , data.location.town);

    if (!location) {
      location = await FoodSpotRepository.createLocation({
            locality: data.location.locality,
            town: data.location.town,
            city: data.location.city,
            state: data.location.state,
      });
    }

    const duplicate = await FoodSpotRepository.findDuplicate(  data.name.trim() ,  location.id );

    if (duplicate) {
      return {
        success: false,
        message: "Food spot already exists",
        data: null,
      };
    }

    const foodSpot = await FoodSpotRepository.create(
      {
        name: data.name.trim(),
        spotRating: data.spotRating,
        tags: data.tags,

        user: {
          connect: {
            id: userId,
          },
        },

        location: {
          connect: {
            id: location.id,
          },
        },
      });

    return {
      success: true,
      message: "Food spot added successfully",
      data: foodSpotToDTO(foodSpot),
    };

  } catch (error) {

    return {
      success: false,
      message: (error as Error).message,
      data: null,
    };
  }
};