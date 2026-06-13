import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Clock, Flag, MapPin, Share2, Star } from "lucide-react";

import { RateReviewModal } from "./rate-review-modal";
import { getFoodSpotById } from "../../lib/actions";
import LoaderComponent from "../../components/loader";
import type { FoodSpotDTO } from "../../../shared/food-spots.type";
import { BottomNav } from "./bottom-nav";

export default function SpotDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [showRateModal, setShowRateModal] = useState(false);
  const spotId = id ?? "";

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["spot", spotId],
    queryFn: () => getFoodSpotById(spotId),
    enabled: !!id,
  });

  const spot = data?.data as FoodSpotDTO | undefined;

  if (!id) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="rounded-3xl border border-border bg-card px-6 py-10 text-center space-y-3">
          <div className="text-4xl">⚠️</div>
          <p className="text-sm font-semibold text-foreground">Spot id doesn&apos;t exist</p>
          <p className="text-sm text-muted-foreground">Go back and open a valid listing.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <LoaderComponent />
      </main>
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

  if (!spot) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="rounded-3xl border border-border bg-card px-6 py-10 text-center space-y-3">
          <div className="text-4xl">⚠️</div>
          <p className="text-sm font-semibold text-foreground">Spot not found</p>
          <p className="text-sm text-muted-foreground">
            This listing may have been removed or is still being processed.
          </p>
        </div>
      </div>
    );
  }

  const locationLabel = [
    spot.location?.locality,
    spot.location?.town,
    spot.location?.city,
    spot.location?.state,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="min-h-screen bg-background pb-28 text-foreground">
      <div className="relative overflow-hidden">
        <div className="relative h-72 bg-secondary/80">
          {spot.imageUrl ? (
            <img src={spot.imageUrl} alt={spot.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary/15">
              <span className="text-7xl">🍽️</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/75" />
        </div>

        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 py-4">
          <Link
            to="/app/search"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-card/80 text-foreground shadow-lg shadow-slate-900/10 transition hover:bg-card"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <button
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-card/80 text-foreground shadow-lg shadow-slate-900/10 transition hover:bg-card"
            aria-label="Share"
          >
            <Share2 className="h-5 w-5" />
          </button>
        </div>

        <div className="absolute inset-x-4 bottom-4 rounded-[2rem] border border-border bg-card/95 p-5 shadow-xl shadow-slate-950/10 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                {spot.status ?? "PENDING"}
              </p>
              <h1 className="mt-3 text-3xl font-extrabold text-foreground">{spot.name}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {locationLabel || "Unknown location"}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-secondary/90 px-3 py-1 text-[11px] font-semibold text-secondary-foreground">
                  <Star className="h-3.5 w-3.5 fill-current text-primary" />
                  {spot.spotRating}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 text-right">
              <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Fresh listing</span>
              <span className="rounded-2xl bg-green-50 px-3 py-2 text-xs font-semibold text-green-700">
                Submitted for review
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-4 pt-6">
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <div className="rounded-[2rem] border border-border bg-card p-5 shadow-sm shadow-slate-900/5">
              <h2 className="text-lg font-extrabold text-foreground">About this place</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                A community-added spot waiting for attention from the moderation queue.
              </p>
            </div>

            <div className="rounded-[2rem] border border-border bg-card p-5 shadow-sm shadow-slate-900/5">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                    Status
                  </p>
                  <p className="mt-1 text-sm font-bold text-foreground">{spot.status ?? "PENDING"}</p>
                </div>
              </div>
              <div className="mt-4 rounded-3xl bg-secondary/80 px-4 py-3 text-sm text-muted-foreground">
                Review it carefully before it goes live.
              </div>
            </div>

            <button
              onClick={() => setShowRateModal(true)}
              className="w-full rounded-[1.5rem] bg-primary px-5 py-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/15 transition hover:bg-primary/90"
            >
              Rate this place
            </button>
          </div>

          <div className="space-y-5">
            <div className="rounded-[2rem] border border-border bg-card p-5 text-center shadow-sm shadow-slate-900/5">
              <button className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
                <Flag className="h-4 w-4" />
                Report this listing
              </button>
            </div>
          </div>
        </div>
      </main>

      {showRateModal && <RateReviewModal onClose={() => setShowRateModal(false)} spotName={spot.name} />}
      <BottomNav />
    </div>
  );
}
