import type { SpotRating, Tags } from "../generated/prisma/enums";

export const generateAllSpotsKey = ( search: string, tags: Tags[], rating: SpotRating | undefined,  page: number , limit: number): string => {
    
    const normalizedSearch = search.trim().toLowerCase();

    const normalizedTags = [...tags].sort().join(",");

    const normalizedRating = rating ?? "all";

    return [  "food-spots",  normalizedSearch,  normalizedTags,  normalizedRating,  page,  limit,].join(":");
};

export const generateUserSpotsKey = (  userId: string,  search: string,  tags: Tags[],  rating: SpotRating | undefined,  page: number,  limit: number): string => {

  const normalizedSearch = search.trim().toLowerCase();

  const normalizedTags = [...tags].sort().join(",");

  const normalizedRating = rating ?? "all";

  return [ "user-submissions", userId, normalizedSearch, normalizedTags, normalizedRating, page, limit,].join(":");
};

export const generatePendingSpotsKey = (page: number, limit: number): string => {
  return ["pending-food-spots", page, limit].join(":");
};
