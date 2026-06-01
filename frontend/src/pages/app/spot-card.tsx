import { Link } from "react-router-dom";
import { Star, MapPin } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { FoodSpotDTO } from "../../../../shared/food-spots.type";


interface SpotCardProps {
  spot: FoodSpotDTO;
  variant?: "horizontal" | "vertical";
  className?: string;
}

export function SpotCard({ spot, variant = "vertical", className }: SpotCardProps) {
  const tagClasses = "inline-flex items-center rounded-full bg-secondary/90 px-3 py-1 text-[11px] font-semibold text-secondary-foreground";

  if (variant === "horizontal") {
    return (
      <Link to={`/spot/${spot.id}`} className={cn("group block w-44 flex-shrink-0 transition-transform duration-300 hover:-translate-y-1", className)}>
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-shadow duration-300 group-hover:shadow-md">
          <div className="relative h-28 overflow-hidden bg-slate-100">
            {spot.imageUrl ? (
              <img src={spot.imageUrl} alt={spot.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary/10">
                <span className="text-3xl">🍽️</span>
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 mx-3 mb-3 rounded-2xl bg-background/90 px-3 py-2 text-[11px] font-semibold text-foreground backdrop-blur">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span className="truncate">{spot.location}</span>
              </div>
            </div>
          </div>
          <div className="space-y-2 p-3">
            <p className="text-sm font-bold text-foreground leading-tight line-clamp-2">{spot.name}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Star className="h-3 w-3 fill-primary text-primary" />
              <span>{spot.spotRating}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {spot.tags.slice(0, 2).map((tag) => (
                <span key={tag} className={tagClasses}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/spot/${spot.id}`} className={cn("group block transition-transform duration-300 hover:-translate-y-1", className)}>
      <div className="overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-sm transition-shadow duration-300 group-hover:shadow-lg">
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          {spot.imageUrl ? (
            <img src={spot.imageUrl} alt={spot.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary/10">
              <span className="text-5xl">🍽️</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
          <div className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-2 text-xs font-semibold text-foreground backdrop-blur">
            {spot.location}
          </div>
          <div className="absolute right-4 bottom-4 flex items-center gap-2 rounded-full bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-lg shadow-primary/20">
            <Star className="h-3 w-3 fill-current" />
            {spot.spotRating}
          </div>
        </div>

        <div className="space-y-3 p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-foreground leading-tight">{spot.name}</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {spot.tags.slice(0, 3).map((tag) => (
              <span key={tag} className={tagClasses}>
                {tag}
              </span>
            ))}
          </div>
          <button className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
            View details
          </button>
        </div>
      </div>
    </Link>
  );
}
