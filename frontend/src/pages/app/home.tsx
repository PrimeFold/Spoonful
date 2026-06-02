import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Bell, Plus, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { BottomNav } from "./bottom-nav";
import { SpotCard } from "./spot-card";
import { authClient } from "../../../lib/auth";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { getAllFoodSpots } from "../../../lib/actions";
import LoaderComponent from "../../../components/loader";
import type { FoodSpotDTO,  SpotRatingDTO,  TagsDTO } from "../../../../shared/food-spots.type";

const TAG_LABELS: Record<TagsDTO, string> = {
  BUDGET: "💰 Budget",
  NON_VEG: "🍖 Non-Veg",
  HOME_STYLE: "🏠 Home Style",
  LATE_NIGHT: "🌙 Late Night",
  NORTH_INDIAN: "🫓 North Indian",
  SNACKS: "🍟 Snacks",
  SOUTH_INDIAN: "🍛 South Indian",
  TIFFIN: "🥡 Tiffin",
  VEG: "🥦 Veg",
};

const RATINGS: { label: string; value: SpotRatingDTO }[] = [
  { label: "👎 Bad", value: "ONESTAR" },
  { label: "😒 Okish", value: "TWOSTAR" },
  { label: "👍 Good enough", value: "THREESTAR" },
  { label: "😋 Great", value: "FOURSTAR" },
  { label: "🏆 Delicious", value: "FIVESTAR" },
];

const filters: TagsDTO[] = [
  "BUDGET",
  "NON_VEG",
  "HOME_STYLE",
  "LATE_NIGHT",
  "NORTH_INDIAN",
  "SNACKS",
  "SOUTH_INDIAN",
  "TIFFIN",
  "VEG",
];

export default function HomePage() {
  const [selectedTags, setSelectedTags] = useState<TagsDTO[]>([]);
  const [selectedRating, setSelectedRating] = useState<SpotRatingDTO>();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const limit = 10;


  const { data: session, error: sessionError, isPending: sessionLoading } = authClient.useSession();

  const user = session?.user;

  useEffect(() => {
    if (sessionError) toast.error(sessionError.message);
  }, [sessionError]);

  const currentHour = new Date().getHours();

  const { meal, timeOfDay, greeting } = useMemo(() => {
    if (currentHour >= 12 && currentHour < 16)
      return { meal: "Lunch", timeOfDay: "Afternoon", greeting: "Good afternoon" };
    if (currentHour >= 16)
      return { meal: "Dinner", timeOfDay: "Evening", greeting: "Good evening" };
    return { meal: "Breakfast", timeOfDay: "Morning", greeting: "Good morning" };
  }, [currentHour]);

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["all-food-spots", searchQuery, selectedTags, selectedRating, page],
    queryFn: () =>
      getAllFoodSpots({ search: searchQuery, tags: selectedTags, rating: selectedRating, page, limit }),
  });

  const spots: FoodSpotDTO[] = data?.data.items ?? [];
  const pagination = data?.data.pagination;

  if (isLoading || sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoaderComponent />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center space-y-3">
          <div className="text-4xl">⚠️</div>
          <p className="text-sm font-semibold text-red-500">
            {(error as Error)?.message || "Something went wrong"}
          </p>
        </div>
      </div>
    );
  }

  const activeFilterCount = selectedTags.length + (selectedRating ? 1 : 0);

  return (
    <div className="min-h-screen bg-background pb-36 md:pb-28">

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-lg md:max-w-3xl lg:max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-black">S</span>
            </div>
            <span className="font-black text-foreground tracking-tight text-lg">
              Spoonful
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link to="/app/profile">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center font-bold text-primary-foreground text-sm ring-2 ring-primary/30 hover:ring-primary/60 transition-all">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-lg md:max-w-3xl lg:max-w-5xl mx-auto px-4">

        {/* ── Hero greeting ── */}
        <div className="pt-6 pb-5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">
            {greeting} 👋
          </p>
          <h1 className="text-2xl font-black text-foreground leading-tight">
            What's for{" "}
            <span className="text-primary">{meal}</span> today?
          </h1>
        </div>

        {/* ── Search + Filter row ── */}
        <div className="sticky top-14 z-30 bg-background/95 backdrop-blur py-2 flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search spots, dishes, areas..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              className="w-full bg-card border border-border rounded-2xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
            />
          </div>

          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`relative w-10 h-10 rounded-2xl border flex items-center justify-center transition-colors ${
              showFilters || activeFilterCount > 0
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border text-muted-foreground hover:text-foreground"
            }`}
            aria-label="Filters"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-background">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* ── Expandable filter panel ── */}
        {showFilters && (
         <div className="bg-card border border-border rounded-2xl p-4 mb-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Tag filters */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Category
              </p>
              <div className="flex flex-wrap gap-2">
                {filters.map((tag) => {
                  const selected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => {
                        setPage(1);
                        setSelectedTags((prev) =>
                          selected ? prev.filter((t) => t !== tag) : [...prev, tag]
                        );
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                        selected
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-foreground hover:bg-secondary/70"
                      }`}
                    >
                      {TAG_LABELS[tag]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rating filter */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Rating
              </p>
              <div className="flex flex-wrap gap-2">
                {RATINGS.map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => {
                      setPage(1);
                      setSelectedRating((prev) => (prev === value ? undefined : value));
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      selectedRating === value
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground hover:bg-secondary/70"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear */}
            {activeFilterCount > 0 && (
              <button
                onClick={() => { setSelectedTags([]); setSelectedRating(undefined); setPage(1); }}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* ── Quick-scroll tag pills (always visible) ── */}
        {!showFilters && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 mb-5">
            {filters.map((tag) => {
              const selected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => {
                    setPage(1);
                    setSelectedTags((prev) =>
                      selected ? prev.filter((t) => t !== tag) : [...prev, tag]
                    );
                  }}
                  className={`snap-start flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                    selected
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {TAG_LABELS[tag]}
                </button>
              );
            })}
          </div>
        )}

        {/* ── Section header ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-black text-base text-foreground">
                {searchQuery ? `Results for "${searchQuery}"` : "Recently Added"}
              </h2>
              {pagination && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {pagination.total} spot{pagination.total !== 1 ? "s" : ""} found
                </p>
              )}
            </div>

            {!searchQuery && (
              <Link
                to="/app/search"
                className="text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-full transition-colors"
              >
                See all →
              </Link>
            )}
          </div>

          {/* ── Empty state ── */}
          {spots.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-20 h-20 rounded-3xl bg-secondary flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🍽️</span>
              </div>
              <h3 className="font-black text-foreground text-lg mb-2">No spots found</h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed max-w-xs mx-auto">
                Looks like this spot doesn't exist yet. Be the first to put it on the map!
              </p>
              <Link
                to="/app/add-spot"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-6 py-3 rounded-2xl text-sm hover:bg-primary/90 transition-all hover:scale-105"
              >
                <Plus className="h-4 w-4" />
                Add a Spot
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {spots.map((spot) => (
                <SpotCard key={spot.id} spot={spot} variant="vertical" />
              ))}
            </div>
          )}
        </section>

        {/* ── Pagination ── */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between gap-3 mt-8 mb-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="flex items-center justify-center gap-1.5 min-w-[110px] px-4 py-2 rounded-xl bg-secondary text-sm font-semibold text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-secondary/70 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </button>

            <span className="text-xs font-semibold text-muted-foreground bg-secondary px-3 py-1.5 rounded-full">
              {pagination.page} / {pagination.totalPages}
            </span>

            <button
              disabled={!pagination.hasMore}
              onClick={() => setPage((p) => p + 1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-secondary text-sm font-semibold text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-secondary/70 transition-colors"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </main>

      {/* ── FAB ── */}
      <Link
        to="/app/add-spot"
        className="fixed bottom-20 right-4 md:right-8 lg:right-12 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg shadow-primary/30 flex items-center justify-center hover:bg-primary/90 transition-all hover:scale-105 z-40"
        aria-label="Add a spot"
      >
        <Plus className="h-6 w-6" />
      </Link>

      <BottomNav />
    </div>
  );
}