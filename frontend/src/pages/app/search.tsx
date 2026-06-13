import { useDeferredValue, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ChevronLeft, ChevronRight, Search, Sparkles, X } from "lucide-react";

import { BottomNav } from "../../components/bottom-nav";
import ErrorPage from "../error/error";
import { SpotCard } from "../../components/spot-card";
import { getAllFoodSpots } from "../../../lib/actions";
import type { TagsDTO } from "../../../../shared/food-spots.type";
import { cn } from "../../../lib/utils";

const TAG_FILTERS: { label: string; value: TagsDTO | "All" }[] = [
  { label: "All", value: "All" },
  { label: "Veg", value: "VEG" },
  { label: "Non Veg", value: "NON_VEG" },
  { label: "Budget", value: "BUDGET" },
  { label: "Tiffin", value: "TIFFIN" },
  { label: "Snacks", value: "SNACKS" },
  { label: "North Indian", value: "NORTH_INDIAN" },
  { label: "South Indian", value: "SOUTH_INDIAN" },
  { label: "Late Night", value: "LATE_NIGHT" },
  { label: "Home Style", value: "HOME_STYLE" },
];

const LIMIT = 12;

export default function SearchPage() {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<TagsDTO | "All">("All");
  const [page, setPage] = useState(1);
  const deferredSearch = useDeferredValue(search.trim());

  useEffect(() => {
    setPage(1);
  }, [search, activeTag]);

  useEffect(() => {
    if (page > 1) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [page]);

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["search-food-spots", deferredSearch, activeTag, page],
    queryFn: () =>
      getAllFoodSpots({
        search: deferredSearch || undefined,
        tags: activeTag === "All" ? undefined : [activeTag],
        page,
        limit: LIMIT,
      }),
  });

  const spots = data?.data?.items ?? [];
  const pagination = data?.data?.pagination;
  const activeFilterCount = activeTag === "All" ? 0 : 1;
  const showSkeleton = isLoading && spots.length === 0;

  if (isError) {
    return <ErrorPage error={error} />;
  }

  return (
    <div className="min-h-screen bg-background pb-28">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <Link
            to="/app/home"
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-card transition hover:bg-secondary"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Explore
            </p>
            <h1 className="text-base font-black text-foreground">Search food spots</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <section className="relative overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-foreground via-foreground to-primary/80 p-6 text-primary-foreground shadow-2xl shadow-primary/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.1),transparent_28%)]" />
          <div className="relative max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              Fast, filtered search
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              Find the right spot without fighting the interface.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-primary-foreground/80 sm:text-base">
              Search by name or area, narrow by food type, and browse live results with pagination.
            </p>
          </div>
        </section>

        <div className="sticky top-[72px] z-30 mt-5 space-y-3 bg-background/95 py-3 backdrop-blur">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search spots, dishes, locations..."
                className="w-full rounded-2xl border border-border bg-card py-3 pl-10 pr-10 text-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {TAG_FILTERS.map((filter) => {
              const selected = activeTag === filter.value;

              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setActiveTag(filter.value)}
                  className={cn(
                    "flex-shrink-0 rounded-full border px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all",
                    selected
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border bg-card text-foreground hover:border-primary/30 hover:bg-secondary"
                  )}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-3 text-sm">
            <p className="text-muted-foreground">
              {pagination?.total ?? 0} result{(pagination?.total ?? 0) === 1 ? "" : "s"}
              {deferredSearch ? <> for <span className="font-semibold text-foreground">"{deferredSearch}"</span></> : null}
            </p>

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={() => setActiveTag("All")}
                className="font-semibold text-primary hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {showSkeleton ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="rounded-[1.75rem] border border-border bg-card p-4 shadow-sm animate-pulse"
              >
                <div className="aspect-[4/3] rounded-3xl bg-secondary/80" />
                <div className="mt-4 space-y-3">
                  <div className="h-5 w-2/3 rounded-full bg-secondary/80" />
                  <div className="h-4 w-1/2 rounded-full bg-secondary/80" />
                  <div className="flex gap-2">
                    <div className="h-6 w-16 rounded-full bg-secondary/80" />
                    <div className="h-6 w-20 rounded-full bg-secondary/80" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : spots.length === 0 ? (
          <div className="mt-8 rounded-[2rem] border border-dashed border-border bg-card/60 px-6 py-16 text-center animate-in fade-in duration-300">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-3xl">
              🔍
            </div>
            <h3 className="text-xl font-black text-foreground">No spots found</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Try a different keyword or switch to another food type.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {spots.map((spot, index) => (
              <div
                key={spot.id}
                className="animate-in fade-in slide-in-from-bottom-2 duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <SpotCard spot={spot} variant="vertical" />
              </div>
            ))}
          </div>
        )}

        {pagination && pagination.total > pagination.limit && (
          <div className="mt-8 flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-secondary px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-secondary/80 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </button>

            <span className="rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-muted-foreground">
              Page {pagination.page} of {Math.max(1, Math.ceil(pagination.total / pagination.limit))}
            </span>

            <button
              type="button"
              disabled={!pagination.hasMore}
              onClick={() => setPage((current) => current + 1)}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-secondary px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-secondary/80 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {isFetching && !isLoading && (
          <div className="mt-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground animate-pulse">
            Updating results...
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
