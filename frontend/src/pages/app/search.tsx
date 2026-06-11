import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { BottomNav } from "../../components/bottom-nav"
import {SpotCard} from '../../components/spot-card'
import { MOCK_SPOTS } from "../../../lib/mock-data"
import Navbar from "../../components/Navbar"
import { cn } from "../../../lib/utils"

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
      <Navbar variant="SEARCH"/>
      

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
