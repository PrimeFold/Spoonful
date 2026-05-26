

import { Link } from "react-router-dom";
import { Star, MapPin } from "lucide-react";
import { cn } from "../../../lib/utils";

export interface SpotCardData {
  id: string
  name: string
  area: string
  rating: number
  reviewCount: number
  priceRange: "₹" | "₹₹" | "₹₹₹"
  tags: string[]
  imageUrl?: string
}

interface SpotCardProps {
  spot: SpotCardData
  variant?: "horizontal" | "vertical"
  className?: string
}

export function SpotCard({ spot, variant = "vertical", className }: SpotCardProps) {
  if (variant === "horizontal") {
    return (
      <Link to={`/spot/${spot.id}`} className={cn("block w-44 flex-shrink-0", className)}>
        <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-shadow">
          <div className="relative h-28 bg-secondary overflow-hidden">
            {spot.imageUrl ? (
              <img src={spot.imageUrl} alt={spot.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                <span className="text-3xl">🍽️</span>
              </div>
            )}
            <span className="absolute top-2 right-2 bg-card/90 text-foreground text-xs font-semibold px-1.5 py-0.5 rounded-full">
              {spot.priceRange}
            </span>
          </div>
          <div className="p-2.5">
            <p className="font-bold text-sm text-foreground leading-tight line-clamp-1">{spot.name}</p>
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground line-clamp-1">{spot.area}</span>
            </div>
            <div className="flex items-center gap-1 mt-1.5">
              <Star className="h-3 w-3 fill-primary text-primary" />
              <span className="text-xs font-semibold text-foreground">{spot.rating}</span>
              <span className="text-xs text-muted-foreground">({spot.reviewCount})</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {spot.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link to={`/spot/${spot.id}`} className={cn("block", className)}>
      <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-shadow">
        <div className="relative h-40 bg-secondary overflow-hidden">
          {spot.imageUrl ? (
            <img src={spot.imageUrl} alt={spot.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
              <span className="text-5xl">🍽️</span>
            </div>
          )}
          <span className="absolute top-3 right-3 bg-card/90 text-foreground text-xs font-bold px-2 py-1 rounded-full shadow">
            {spot.priceRange}
          </span>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <p className="font-bold text-base text-foreground leading-tight">{spot.name}</p>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
              <span className="text-sm font-semibold text-foreground">{spot.rating}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{spot.area}</span>
            <span className="text-muted-foreground mx-1">·</span>
            <span className="text-xs text-muted-foreground">{spot.reviewCount} reviews</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {spot.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">
                {tag}
              </span>
            ))}
          </div>
          <button className="mt-3 w-full text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 transition-colors py-2 rounded-xl">
            View Details
          </button>
        </div>
      </div>
    </Link>
  )
}
