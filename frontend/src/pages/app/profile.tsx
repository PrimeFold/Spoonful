import { useEffect, useState } from "react";
import {
  LogOut,
  Edit2,
  MapPin,
  GraduationCap,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { cn } from "../../../lib/utils";
import { BottomNav } from "./bottom-nav";
import { useQuery } from "@tanstack/react-query";
import { getUserSubmissions } from "../../../lib/actions";
import { authClient } from "../../../lib/auth";
import toast from "react-hot-toast";
import type { TagsDTO, SpotRatingDTO, FoodSpotDTO } from "../../../../shared/food-spots.type";
import LoaderComponent from "../../../components/loader";

//We'll add my reviews later..


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

export default function ProfilePage() {

  const { data: session, error: sessionError, isPending: sessionLoading } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    if (sessionError) toast.error(sessionError.message);
  }, [sessionError]);

  const [selectedTags, setSelectedTags] = useState<TagsDTO[]>([]);
  const [selectedRating, setSelectedRating] = useState<SpotRatingDTO>();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  
  const limit = 10;
  
  const { data, isLoading, error, isError } = useQuery<
    { data: { items: FoodSpotDTO[]; pagination: { page: number; limit: number; total: number; hasMore: boolean } } } | null,
    Error
  >({
    queryKey: ["my-submissions", searchQuery, selectedRating, selectedTags, page],
    queryFn: () =>
      getUserSubmissions({
        search: searchQuery,
        rating: selectedRating,
        tags: selectedTags,
        page,
        limit,
      }),
    enabled: !!user,
  });
  
  const spots: FoodSpotDTO[] = data?.data?.items ?? [];
  const pagination = data?.data?.pagination;
  const totalSubmissions = pagination?.total ?? spots.length;
  const activeFilterCount = selectedTags.length + (selectedRating ? 1 : 0);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
    } catch (error) {
      console.log((error as Error).message);
    }
  };

  const [activeTab, setActiveTab] = useState<   "submissions" | "reviews" >("submissions");


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

  return (
    <div className="min-h-screen bg-background pb-36 md:pb-28">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur border-b border-border">
        <div className="max-w-lg md:max-w-3xl lg:max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="font-bold text-lg text-foreground">
            My Profile
          </h1>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-destructive transition-colors"
            aria-label="Log out"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:block">Log out</span>
          </button>
        </div>
      </header>

      <main className="max-w-lg md:max-w-3xl lg:max-w-5xl mx-auto px-4">
        {/* Profile card */}
        <div className="mt-5 bg-card rounded-3xl border border-border p-5">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center font-extrabold text-primary text-2xl flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase() ?? user?.email?.charAt(0).toUpperCase() ?? "U"}
            </div>

            <div className="flex-1 w-full min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-extrabold text-lg text-foreground truncate">
                    {user?.name ?? user?.email ?? "Your profile"}
                  </p>

                  <div className="flex items-center gap-1.5 mt-1">
                    <GraduationCap className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-muted-foreground truncate">
                      {user?.email ?? "No email provided"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 mt-0.5">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-muted-foreground truncate">
                      {user?.emailVerified ? "Verified account" : "Email not verified"}
                    </span>
                  </div>
                </div>

                <button className="flex items-center justify-center gap-1.5 text-xs font-semibold text-foreground bg-secondary border border-border px-3 py-2 rounded-xl hover:bg-border transition-colors w-full sm:w-auto">
                  <Edit2 className="h-3 w-3" />
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* ── Search + Filter row ── */}
        <div className="sticky top-14 z-30 bg-background/95 backdrop-blur py-2 flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search spots, dishes, locations..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
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

        {showFilters && (
          <div className="bg-card border border-border rounded-3xl p-4 mb-4 space-y-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Categories
              </p>
              <div className="flex flex-wrap gap-2">
                {filters.map((tag) => {
                  const selected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        setPage(1);
                        setSelectedTags((prev) =>
                          prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
                        );
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
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
            </div>

            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Rating
              </p>
              <div className="flex flex-wrap gap-2">
                {RATINGS.map(({ label, value }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setPage(1);
                      setSelectedRating((prev) => (prev === value ? undefined : value));
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      selectedRating === value
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          {[
            {
              icon: "🏪",
              label: "Spots Added",
              value: totalSubmissions,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-card rounded-2xl border border-border p-4 text-center"
            >
              <p className="text-2xl mb-1">{stat.icon}</p>
              <p className="text-2xl font-extrabold text-foreground">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-secondary rounded-2xl p-1 mt-5">
          {(["submissions", "reviews"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 py-2.5 px-3 rounded-xl text-sm font-bold transition-all capitalize whitespace-nowrap",
                activeTab === tab
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab === "submissions"
                ? "My Submissions"
                : "My Reviews"}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="mt-4 flex flex-col gap-3">
          {activeTab === "submissions" && (
            <>
              {spots.length === 0 ? (
                <div className="bg-card rounded-3xl border border-border p-8 text-center">
                  <p className="text-sm font-semibold text-muted-foreground mb-2">
                    No submissions found yet.
                  </p>
                  <p className="text-sm text-foreground">
                    Add a spot and it will appear here once submitted.
                  </p>
                </div>
              ) : (
                spots.map((spot) => (
                  <div
                    key={spot.id}
                    className="bg-card rounded-2xl border border-border p-4 flex flex-col gap-3 sm:flex-row sm:items-center"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-xl flex-shrink-0">
                      🍽️
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-foreground truncate">
                        {spot.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {spot.location}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {spot.tags?.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-secondary/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground"
                          >
                            {TAG_LABELS[tag] ?? tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-full bg-secondary px-3 py-2 text-[11px] font-bold uppercase tracking-[0.08em] text-foreground">
                      {spot.spotRating}
                    </div>
                  </div>
                ))
              )}

              {/* Pagination controls */}
              {pagination && (
                <div className="flex items-center justify-between mt-3">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={pagination.page <= 1}
                    className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                      pagination.page <= 1
                        ? "bg-secondary/40 text-muted-foreground cursor-not-allowed"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    Prev
                  </button>

                  <div className="text-sm text-muted-foreground">
                    Page {pagination.page} • {pagination.total} total
                  </div>

                  <button
                    type="button"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!pagination.hasMore}
                    className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                      !pagination.hasMore
                        ? "bg-secondary/40 text-muted-foreground cursor-not-allowed"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}

          {activeTab === "reviews" && (
            <div className="bg-card rounded-3xl border border-border p-8 text-center">
              <p className="text-sm font-semibold text-muted-foreground mb-2">
                Reviews are coming soon.
              </p>
              <p className="text-sm text-foreground">
                You will be able to manage your review activity from this tab.
              </p>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}