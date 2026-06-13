import { useState } from "react"
import { X, Star, Check } from "lucide-react"
import { cn } from "../../lib/utils"


const GOOD_TAGS = ["Great value", "Tasty food", "Friendly", "Clean", "Fast service", "Big portions", "Authentic"]

interface RateReviewModalProps {
  spotName: string
  onClose: () => void
}

export function RateReviewModal({ spotName, onClose }: RateReviewModalProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [review, setReview] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const toggleTag = (tag: string) =>
    setSelectedTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) return
    setSubmitted(true)
    setTimeout(onClose, 1800)
  }

  const ratingLabels = ["", "Poor", "Okay", "Good", "Great", "Amazing!"]

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-foreground/30 backdrop-blur-sm px-4 pb-4 sm:pb-0">
      <div className="bg-card rounded-3xl w-full max-w-sm border border-border shadow-xl overflow-hidden">
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <span className="text-3xl">🎉</span>
            </div>
            <h3 className="font-extrabold text-xl text-foreground mb-2">Thanks for rating!</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your review helps other students find great food. You&apos;re a legend.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div>
                <h2 className="font-extrabold text-base text-foreground">Rate this place</h2>
                <p className="text-xs text-muted-foreground mt-0.5">{spotName}</p>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-5 py-5 flex flex-col gap-5">
              {/* Star rating */}
              <div>
                <p className="text-sm font-bold text-foreground mb-3">Overall rating</p>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110"
                      aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                    >
                      <Star
                        className={cn(
                          "h-9 w-9 transition-colors",
                          (hoverRating || rating) >= star
                            ? "fill-primary text-primary"
                            : "text-border"
                        )}
                      />
                    </button>
                  ))}
                  {(hoverRating || rating) > 0 && (
                    <span className="text-sm font-bold text-primary ml-1">
                      {ratingLabels[hoverRating || rating]}
                    </span>
                  )}
                </div>
              </div>

              {/* Tag pills */}
              <div>
                <p className="text-sm font-bold text-foreground mb-3">What was good?</p>
                <div className="flex flex-wrap gap-2">
                  {GOOD_TAGS.map((tag) => {
                    const sel = selectedTags.includes(tag)
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                          sel
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background border-border text-foreground hover:bg-secondary"
                        )}
                      >
                        {sel && <Check className="h-3 w-3" />}
                        {tag}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Written review */}
              <div>
                <label htmlFor="review-text" className="text-sm font-bold text-foreground mb-2 block">
                  Your review <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <textarea
                  id="review-text"
                  placeholder="Tell other students about your experience..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  rows={3}
                  className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition"
                />
              </div>

              <button
                type="submit"
                disabled={rating === 0}
                className={cn(
                  "w-full font-bold py-3.5 rounded-2xl text-sm transition-all",
                  rating > 0
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                Submit review
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
