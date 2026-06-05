import { ArrowLeft, Share2, MapPin, Star, Clock, Flag } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { RateReviewModal } from "./rate-review-modal";
import { BottomNav } from "./bottom-nav";
import { useQuery } from "@tanstack/react-query";
import { getFoodSpotById } from "../../../lib/actions";
import toast from "react-hot-toast";
import LoaderComponent from "../../../components/loader";

export default function SpotDetailPage() {
  const { id } = useParams<{ id: string }>();

  if(id == undefined){
    return toast.error("Spot id doesn't exist")
  }

  const { data , error , isLoading , isError} = useQuery({
    queryKey:[`spot`,id],
    queryFn:()=>getFoodSpotById(id)
  })
  const spot = data;

  if(isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <LoaderComponent/>
      </main>
    )
  }

  if(isError){
    return(
       <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center space-y-3">
          <div className="text-4xl">⚠️</div>
          <p className="text-sm font-semibold text-red-500">
            {(error as Error)?.message || "Something went wrong"}
          </p>
        </div>
      </div>
    )
  }

  const [showRateModal, setShowRateModal] = useState(false);

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
            to="/app/home"
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
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">{spot.priceRange}</p>
              <h1 className="mt-3 text-3xl font-extrabold text-foreground">{spot.name}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {spot.area}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-secondary/90 px-3 py-1 text-[11px] font-semibold text-secondary-foreground">
                  <Star className="h-3.5 w-3.5 fill-current text-primary" />
                  {spot.rating}
                </span>
                <span className="rounded-full bg-secondary/90 px-3 py-1 text-[11px] font-semibold text-secondary-foreground">{spot.reviewCount} reviews</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 text-right">
              <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Open now</span>
              <span className="rounded-2xl bg-green-50 px-3 py-2 text-xs font-semibold text-green-700">Open until 10:30 PM</span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 pt-6">
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <div className="rounded-[2rem] border border-border bg-card p-5 shadow-sm shadow-slate-900/5">
              <h2 className="text-lg font-extrabold text-foreground">About this place</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                A beloved neighborhood spot known for generous portions and honest home-style cooking. Popular among locals for consistently great value and fast service.
              </p>
            </div>

            <div className="rounded-[2rem] border border-border bg-card p-5 shadow-sm shadow-slate-900/5">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Open hours</p>
                  <p className="mt-1 text-sm font-bold text-foreground">7:00 AM – 10:30 PM</p>
                </div>
              </div>
              <div className="mt-4 rounded-3xl bg-secondary/80 px-4 py-3 text-sm text-muted-foreground">
                Consistently open through the evening with curated comfort food favorites and fast pickup service.
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
