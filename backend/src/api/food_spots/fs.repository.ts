import { prisma } from "../../lib/auth/auth";
import {
  Prisma,
  SpotRating,
  VerificationStatus,
} from "../../generated/prisma/client";

export const FOOD_SPOT_SELECT = {
  id: true,
  name: true,
  userId: true,
  location: true,
  tags: true,
  spotRating: true,
  status:true,
  createdAt:true
} as const;

export const FoodSpotRepository = {
  async findLocation(
    locality: string,
    city: string,
    state: string,
    town?: string | null
  ) {
    return prisma.location.findFirst({
      where: {
        locality,
        city,
        state,
        town: town ?? null,
      },
    });
  },

  async createLocation(
    data: Prisma.LocationCreateInput
  ) {
    return prisma.location.create({
      data,
    });
  },

  async findDuplicate(
    name: string,
    locationId: string
  ) {
    return prisma.foodSpots.findFirst({
      where: {
        name,
        locationId,
      },
    });
  },

  async create(
    data: Prisma.FoodSpotsCreateInput
  ) {
    return prisma.foodSpots.create({
      data,
      select: FOOD_SPOT_SELECT,
    });
  },

  async findById(id: string) {
    return prisma.foodSpots.findUnique({
      where: { id },
      select: FOOD_SPOT_SELECT,
    });
  },

  async updateRating(
    id: string,
    rating: SpotRating
  ) {
    return prisma.foodSpots.update({
      where: { id },
      data: {
        spotRating: rating,
      },
      select: FOOD_SPOT_SELECT,
    });
  },

  

  async findMany(
    where: Prisma.FoodSpotsWhereInput,
    skip: number,
    take: number
  ) {
    return prisma.foodSpots.findMany({
      where,
      skip,
      take,
      select: FOOD_SPOT_SELECT,
    });
  },

  async count(
    where: Prisma.FoodSpotsWhereInput
  ) {
    return prisma.foodSpots.count({
      where,
    });
  },
  //Admin functions
  async findPendingSpots(){
    return prisma.foodSpots.findMany({
      where:{
        status:"PENDING"
      },
      select:FOOD_SPOT_SELECT
    })
  },

  async findPendingSpotsPaginated(skip:number, take:number){
    return prisma.foodSpots.findMany({
      where:{
        status:"PENDING"
      },
      skip,
      take,
      select:FOOD_SPOT_SELECT
    })
  },

  async countPendingSpots(){
    return prisma.foodSpots.count({
      where:{
        status:"PENDING"
      }
    })
  },

  async verifyPendingSpot(id:string,status:VerificationStatus){
    if (status === "REJECTED") {
      const spot = await prisma.foodSpots.findUnique({
        where: { id },
        select: { locationId: true }
      });
      const deletedSpot = await prisma.foodSpots.delete({
        where: { id }
      });
      if (spot?.locationId) {
        await prisma.location.delete({
          where: { id: spot.locationId }
        }).catch(() => {
          // ignore if deletion fails
        });
      }
      return deletedSpot;
    }

    return prisma.foodSpots.update({
      where:{
        id
      },
      data:{
        status
      }
    })
  },


  

}
