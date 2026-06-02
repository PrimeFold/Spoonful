import { ArrowLeft, Check, Clock, X, Upload } from "lucide-react"
import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { cn } from "../../../lib/utils"
import { BottomNav } from "./bottom-nav"
import { useMutation } from "@tanstack/react-query"
import { AddFoodSpot } from "../../../lib/actions"
import type { TagsDTO, SpotRatingDTO } from "../../../../shared/food-spots.type"
import toast from "react-hot-toast"
import LoaderComponent from "../../../components/loader"

const SPOT_TAGS: { label: string; value: TagsDTO }[] = [
  { label: "Veg", value: "VEG" },
  { label: "Non-Veg", value: "NON_VEG" },
  { label: "North Indian", value: "NORTH_INDIAN" },
  { label: "South Indian", value: "SOUTH_INDIAN" },
  { label: "Snacks", value: "SNACKS" },
  { label: "Tiffin", value: "TIFFIN" },
  { label: "Fast Food", value: "SNACKS" },
  { label: "Chinese", value: "SNACKS" },
  { label: "Breakfast", value: "HOME_STYLE" },
  { label: "Late Night", value: "LATE_NIGHT" },
  { label: "Budget ₹100", value: "BUDGET" },
  { label: "Home Style", value: "HOME_STYLE" },
]

const RATINGS: { label: string; value: SpotRatingDTO }[] = [
  { label: "👎 Bad", value: "ONESTAR" },
  { label: "😒 Okish", value: "TWOSTAR" },
  { label: "👍 Good enough", value: "THREESTAR" },
  { label: "😋 Great", value: "FOURSTAR" },
  { label: "🏆 Delicious", value: "FIVESTAR" },
]


export default function AddSpotPage() {
  const navigate = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    name: "",
    area: "",
    description: "",
    openFrom: "07:00",
    openTo: "22:00",
  })
  const [selectedTags, setSelectedTags] = useState<TagsDTO[]>([])
  const [selectedRating, setSelectedRating] = useState<SpotRatingDTO | undefined>(undefined)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [dragging, setDragging] = useState(false)


  
  const handlePhoto = (file: File) => {
    const url = URL.createObjectURL(file)
    setPhotoPreview(url)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) handlePhoto(file)
  }

  const mutation  = useMutation({
    mutationFn:async()=>AddFoodSpot(form.name,form.area,selectedRating,selectedTags),
    onSuccess:()=>{
      toast.success("Food-spot Added successfully!"),
      setTimeout(() => navigate("/app/home"), 2000)
    }
  })

  function toggleTag(tagValue: TagsDTO) {
    setSelectedTags((prev) => (prev.includes(tagValue) ? prev.filter((t) => t !== tagValue) : [...prev, tagValue]))
  }



  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    try {
      mutation.mutate;
      if(mutation.isError){
        toast.error(((mutation.error) as Error).message);
      }
      while(mutation.isPending){
        return <LoaderComponent/>
      }
      setSubmitted(true)
    } catch (error) {
      toast.error((error as Error).message)
    }
    
  }


  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center pb-24">
        <div className="text-6xl mb-5">🎉</div>
        <h2 className="text-2xl font-extrabold text-foreground mb-2">Spot added!</h2>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
          Thanks for helping a fellow student eat well. Your spot is under review and will be live shortly.
        </p>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button type="button" onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-foreground" aria-label="Go back">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="font-extrabold text-base text-foreground">Add a Spot</h1>
            <p className="text-xs text-muted-foreground">Help a fellow student eat well</p>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Spot name */}
          <div>
            <label htmlFor="spot-name" className="block text-sm font-bold text-foreground mb-1.5">
              Spot name <span className="text-destructive">*</span>
            </label>
            <input
              id="spot-name"
              type="text"
              required
              placeholder="e.g. Sharma Ji Dhaba"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Area */}
          <div>
            <label htmlFor="spot-area" className="block text-sm font-bold text-foreground mb-1.5">
              Area / Locality <span className="text-destructive">*</span>
            </label>
            <input
              id="spot-area"
              type="text"
              required
              placeholder="e.g. Koramangala, HSR Layout"
              value={form.area}
              onChange={(e) => setForm({ ...form, area: e.target.value })}
              className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="spot-desc" className="block text-sm font-bold text-foreground mb-1.5">
              Description
            </label>
            <textarea
              id="spot-desc"
              rows={3}
              placeholder="What makes this place special? What should students try?"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>
          {/* Tags */}
          <div>
            <p className="text-sm font-bold text-foreground mb-2">Tags</p>
            <div className="flex flex-wrap gap-2">
              {SPOT_TAGS.map(({ label, value }) => {
                const sel = selectedTags.includes(value)
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleTag(value)}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                      sel
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border text-foreground hover:bg-secondary"
                    )}
                  >
                    {sel && <Check className="h-3 w-3" />}
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Rating */}
          <div>
            <p className="text-sm font-bold text-foreground mb-2">Rating</p>
            <div className="flex flex-wrap gap-2">
              {RATINGS.map(({ label, value }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSelectedRating((prev) => (prev === value ? undefined : value))}
                  className={cn(
                    "px-3 py-2 rounded-xl text-xs font-semibold transition-colors",
                    selectedRating === value
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Open hours */}
          <div>
            <p className="text-sm font-bold text-foreground mb-2 flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Open hours
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label htmlFor="open-from" className="text-xs text-muted-foreground mb-1 block">From</label>
                <input
                  id="open-from"
                  type="time"
                  value={form.openFrom}
                  onChange={(e) => setForm({ ...form, openFrom: e.target.value })}
                  className="w-full bg-card border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <span className="text-muted-foreground mt-5">–</span>
              <div className="flex-1">
                <label htmlFor="open-to" className="text-xs text-muted-foreground mb-1 block">To</label>
                <input
                  id="open-to"
                  type="time"
                  value={form.openTo}
                  onChange={(e) => setForm({ ...form, openTo: e.target.value })}
                  className="w-full bg-card border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
          </div>

          {/* Photo upload */}
          <div>
            <p className="text-sm font-bold text-foreground mb-2">Photo</p>
            {photoPreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-border h-44">
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setPhotoPreview(null)}
                  className="absolute top-2 right-2 w-8 h-8 bg-foreground/60 text-background rounded-full flex items-center justify-center hover:bg-foreground/80 transition"
                  aria-label="Remove photo"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={cn(
                  "border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all",
                  dragging ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/50 hover:bg-secondary/50"
                )}
              >
                <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center">
                  <Upload className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">Drop a photo here</p>
                  <p className="text-xs text-muted-foreground mt-0.5">or tap to browse — JPG, PNG up to 10MB</p>
                </div>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePhoto(f) }} />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!form.name || !form.area }
            className={cn(
              "w-full font-bold py-4 rounded-2xl text-sm transition-all mt-2",
              form.name && form.area
                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-primary/20"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            Add to Spoonful
          </button>
          <p className="text-center text-xs text-muted-foreground -mt-2 mb-2">
            Your spot will be reviewed before going live. Usually within 24 hours.
          </p>
        </form>
      </main>
      <BottomNav />
    </div>
  )
}
