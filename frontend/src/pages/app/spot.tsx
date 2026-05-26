import { ArrowLeft, Share2, MapPin, Star, Clock, Flag } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { RateReviewModal } from "./rate-review-modal";
import { MOCK_SPOTS, MOCK_REVIEWS } from "../../../lib/mock-data";
import { BottomNav } from "../components/bottom-nav";

export default function SpotDetailPage() {
  const { id } = useParams<{ id: string }>();

  const spot = MOCK_SPOTS.find((s) => s.id === id) || MOCK_SPOTS[0]
  const [showRateModal, setShowRateModal] = useState(false)

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero photo */}
      <div className="relative h-64 bg-secondary overflow-hidden">
        {spot.imageUrl ? (
          <img src={spot.imageUrl} alt={spot.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary/20 to-accent/20">
            <span className="text-7xl">🍽️</span>
          </div>
        )}
        {/* Back button */}
        <Link
          to="/app/home"
          className="absolute top-4 left-4 w-9 h-9 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow text-foreground hover:bg-card transition"
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <button
          className="absolute top-4 right-4 w-9 h-9 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow text-foreground hover:bg-card transition"
          aria-label="Share"
        >
          <Share2 className="h-4 w-4" />
        </button>
        <span className="absolute bottom-4 right-4 bg-card/90 text-foreground text-sm font-extrabold px-3 py-1.5 rounded-full shadow">
          {spot.priceRange}
        </span>
      </div>

      <main className="max-w-lg mx-auto px-4">
        {/* Spot name + rating */}
        <div className="pt-5 pb-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-extrabold text-foreground leading-tight">{spot.name}</h1>
              <div className="flex items-center gap-1.5 mt-1">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{spot.area}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-xl">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="font-extrabold text-foreground">{spot.rating}</span>
              </div>
              <span className="text-xs text-muted-foreground">{spot.reviewCount} reviews</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {spot.tags.map((tag) => (
              <span key={tag} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground border border-border">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="mt-4 p-4 bg-card rounded-2xl border border-border">
          <h2 className="font-extrabold text-sm text-foreground mb-2">About this place</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A beloved neighbourhood spot known for its generous portions and home-style cooking.
            Popular among students for being consistently great value — you leave full, you leave happy.
            No frills, no fuss. Just honest food.
          </p>
        </div>

        {/* Open hours */}
        <div className="mt-3 flex items-center gap-3 p-4 bg-card rounded-2xl border border-border">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Clock className="h-4.5 w-4.5 h-[18px] w-[18px] text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Open hours</p>
            <p className="text-sm font-bold text-foreground">7:00 AM – 10:30 PM</p>
          </div>
          <span className="ml-auto text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">Open now</span>
        </div>

        {/* Rate button */}
        <button
          onClick={() => setShowRateModal(true)}
          className="w-full mt-5 bg-primary text-primary-foreground font-bold py-4 rounded-2xl hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20 text-sm flex items-center justify-center gap-2"
        >
          <Star className="h-4.5 w-4.5 h-[18px] w-[18px]" />
          Rate this place
        </button>

        {/* Reviews */}
        <section className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-extrabold text-base text-foreground">Reviews</h2>
            <span className="text-xs text-muted-foreground">{MOCK_REVIEWS.length} reviews</span>
          </div>

          <div className="flex flex-col gap-3">
            {MOCK_REVIEWS.map((review) => (
              <div key={review.id} className="bg-card rounded-2xl border border-border p-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm flex-shrink-0">
                    {review.userInitial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold text-sm text-foreground">{review.userName}</p>
                      <span className="text-xs text-muted-foreground flex-shrink-0">{review.date}</span>
                    </div>
                    <div className="flex gap-0.5 my-1.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < review.rating ? "fill-primary text-primary" : "text-border"}`} />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {review.tags.map((t) => (
                        <span key={t} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Report link */}
        <div className="mt-6 mb-2 text-center">
          <button className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors">
            <Flag className="h-3 w-3" />
            Report this listing
          </button>
        </div>
      </main>

      {showRateModal && <RateReviewModal onClose={() => setShowRateModal(false)} spotName={spot.name} />}
      <BottomNav />
    </div>
  )
}
