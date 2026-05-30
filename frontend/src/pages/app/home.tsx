import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Bell, Plus } from "lucide-react";
import { BottomNav } from "./bottom-nav";
import { SpotCard } from "./spot-card";
import { authClient } from "../../../lib/auth";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { getAllFoodSpots } from "../../../lib/actions";
import LoaderComponent from "../../../components/loader";
import {SpotRating, Tags} from '../../../../backend/src/generated/prisma/client'
import { type FoodSpotDTO} from '../../../../shared/food-spots.type'

export default function HomePage() {  
  const [selectedTags, setSelectedTags] = useState<Tags[]>([]);
  const [selectedRating, setSelectedRating] = useState<SpotRating>();
  const [searchQuery, setSearchQuery] = useState("");
  const [page,setPage] = useState(1);
  const limit = 10;
  
  const filters: Tags[] = [
  Tags.BUDGET,
  Tags.NON_VEG,
  Tags.HOME_STYLE,
  Tags.LATE_NIGHT,
  Tags.NORTH_INDIAN,
  Tags.SNACKS,
  Tags.SOUTH_INDIAN,
  Tags.TIFFIN,
  Tags.VEG
  ];

  const {  data: session,  error: sessionError,  isPending: sessionLoading} = authClient.useSession();
  
  const user = session?.user;

  useEffect(() => {
    if (sessionError) {
      toast.error(sessionError.message);
    }
  }, [sessionError]);

  
  const currentHour = new Date().getHours();

  const { meal, timeOfDay } = useMemo(() => {
    if (currentHour >= 12 && currentHour < 16) {
      return {
        meal: "Lunch",
        timeOfDay: "Afternoon",
      };
    }

    if (currentHour >= 16) {
      return {
        meal: "Dinner",
        timeOfDay: "Evening",
      };
    }

    return {
      meal: "Breakfast",
      timeOfDay: "Morning",
    };
  }, [currentHour]);

  const {  data,  error,  isLoading,  isError } = useQuery({
    queryKey: ["all-food-spots",searchQuery,selectedTags,selectedRating,page],
    queryFn:()=> getAllFoodSpots({search:searchQuery, tags:selectedTags, rating:selectedRating, page,limit})
  });

  const spots : FoodSpotDTO[] = data?.data.items ?? [];
  const pagination = data?.data.pagination;



  if (isLoading || sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoaderComponent />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <p className="text-sm font-semibold text-red-500">
          {(error as Error)?.message || "Something went wrong"}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-foreground">
              Spoonful
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-4.5 w-4.5" />
            </button>

            <Link to="/app/profile">
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4">
        <div className="pt-5 pb-4">
          <p className="text-sm text-muted-foreground">
            Good {timeOfDay}
          </p>

          <h1 className="text-xl font-extrabold text-foreground mt-0.5">
            What&apos;s for {meal} today?
          </h1>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

          <input
            type="search"
            placeholder="Search spots, dishes, areas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card border border-border rounded-2xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 mb-5">
          {filters.map((tag)=>{
            const selected = selectedTags.includes(tag);
            return(
              <button
                key={tag}
                onClick={() => {
                  setPage(1);
                  setSelectedTags((prev) =>
                    selected
                      ? prev.filter((t) => t !== tag)
                      : [...prev, tag]
                  );
                }}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selected
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground"
                  }`}
                >
                {tag}
              </button>
            )
            
          })}
        </div>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-extrabold text-base text-foreground">
              {searchQuery
                ? `Results for "${searchQuery}"`
                : "Recently Added"}
            </h2>

            {!searchQuery && (
              <Link
                to="/app/search"
                className="text-xs font-semibold text-primary hover:underline"
              >
                See all
              </Link>
            )}
          </div>

          {spots.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🍽️</div>

              <h3 className="font-extrabold text-foreground mb-2">
                No spots found
              </h3>

              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Looks like this spot doesn&apos;t exist... yet.
                Be the first to add it!
              </p>

              <Link
                to="/app/add-spot"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-5 py-3 rounded-2xl text-sm"
              >
                <Plus className="h-4 w-4" />
                Add a Spot
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {spots.map((spot) => (
                <SpotCard
                  key={spot.id}
                  spot={spot}
                  variant="vertical"
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <Link
        to="/app/add-spot"
        className="fixed bottom-20 right-4 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg shadow-primary/30 flex items-center justify-center hover:bg-primary/90 transition-all hover:scale-105 z-40"
        aria-label="Add a spot"
      >
        <Plus className="h-6 w-6" />
      </Link>
      <div className="flex items-center justify-between mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Previous
        </button>

        <span>
          Page {pagination?.page} of {pagination?.totalPages}
        </span>

        <button
          disabled={!pagination?.hasMore}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
      <BottomNav />
    </div>
  );
}