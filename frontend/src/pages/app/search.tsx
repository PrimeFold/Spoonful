import { useState } from "react"
import { Search, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { MOCK_SPOTS } from "../../../lib/mock-data"
import { cn } from "../../../lib/utils"
import { BottomNav } from "./bottom-nav"
import {SpotCard} from './spot-card'

const CATEGORIES = ["All", "Under ₹100", "Veg", "South Indian", "North Indian", "Snacks", "Tiffin", "Late Night", "Top Rated"]

export default function SearchPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")

  const filtered = MOCK_SPOTS.filter((s) => {
    const matchesQuery = !query ||
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.area.toLowerCase().includes(query.toLowerCase()) ||
      s.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))

    const matchesCategory =
      activeCategory === "All" ||
      (activeCategory === "Under ₹100" && s.priceRange === "₹") ||
      (activeCategory === "Top Rated" && s.rating >= 4.7) ||
      s.tags.some((t) => t.toLowerCase().includes(activeCategory.toLowerCase()))

    return matchesQuery && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button type="button" onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center flex-shrink-0" aria-label="Go back">
            <ArrowLeft className="h-4 w-4 text-foreground" />
          </button>
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              autoFocus
              placeholder="Spots, dishes, areas..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-card border border-border rounded-2xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            />
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-4">
        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "flex-shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all whitespace-nowrap",
                activeCategory === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border hover:border-primary/40"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-4 font-medium">
          {filtered.length} {filtered.length === 1 ? "spot" : "spots"} found
          {query ? ` for "${query}"` : ""}
        </p>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-extrabold text-foreground mb-2">No spots found</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Try a different search or be the first to add this spot!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((spot) => (
              <SpotCard key={spot.id} spot={spot} variant="vertical" />
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
