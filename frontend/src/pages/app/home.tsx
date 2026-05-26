import { useState } from "react"
import { Link } from "react-router-dom"
import { Search, Bell, Plus } from "lucide-react"
import { MOCK_SPOTS } from "../../../lib/mock-data"
import { cn } from "../../../lib/utils"
import { BottomNav } from "./bottom-nav"
import { SpotCard } from "./spot-card"



function SkeletonCard() {
  return (
    <div className="w-44 shrink-0 bg-card rounded-2xl overflow-hidden border border-border animate-pulse">
      <div className="h-28 bg-muted" />
      <div className="p-2.5 space-y-2">
        <div className="h-3 bg-muted rounded-full w-3/4" />
        <div className="h-3 bg-muted rounded-full w-1/2" />
        <div className="h-3 bg-muted rounded-full w-1/3" />
      </div>
    </div>
  )
}

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredSpots = MOCK_SPOTS.filter((s) => {
    if (searchQuery) {
      return (
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }
    if (activeFilter === "All") return true
    if (activeFilter === "Under ₹100") return s.priceRange === "₹"
    if (activeFilter === "Top Rated") return s.rating >= 4.7
    return s.tags.some((t) => t.toLowerCase().includes(activeFilter.toLowerCase()))
  })

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Sticky header */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🥄</span>
            <span className="font-extrabold text-foreground">Spoonful</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors" aria-label="Notifications">
              <Bell className="h-4.5 w-4.5 h-[18px] w-[18px]" />
            </button>
            <Link to="/app/profile">
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm">
                R
              </div>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4">
        {/* Greeting */}
        <div className="pt-5 pb-4">
          <p className="text-sm text-muted-foreground">Good afternoon, Rahul 👋</p>
          <h1 className="text-xl font-extrabold text-foreground mt-0.5">What&apos;s for lunch today?</h1>
        </div>

        {/* Search bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search spots, dishes, areas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card border border-border rounded-2xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
          />
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 mb-5">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={cn(
                "flex-shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all whitespace-nowrap",
                activeFilter === f
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border hover:border-primary/40"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Popular near your college */}
        {!searchQuery && (
          <section className="mb-7">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-extrabold text-base text-foreground">Popular near your college</h2>
              <Link to="/app/search" className="text-xs font-semibold text-primary hover:underline">See all</Link>
            </div>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
              {MOCK_SPOTS.slice(0, 4).map((spot) => (
                <SpotCard key={spot.id} spot={spot} variant="horizontal" />
              ))}
              <SkeletonCard />
            </div>
          </section>
        )}

        {/* Recently added / Search results */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-extrabold text-base text-foreground">
              {searchQuery ? `Results for "${searchQuery}"` : "Recently Added"}
            </h2>
            {!searchQuery && <Link to="/app/search" className="text-xs font-semibold text-primary hover:underline">See all</Link>}
          </div>

          {filteredSpots.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🍽️</div>
              <h3 className="font-extrabold text-foreground mb-2">No spots found</h3>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Looks like this spot doesn&apos;t exist... yet. Be the first to add it!
              </p>
            <Link to="/app/add-spot"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-5 py-3 rounded-2xl text-sm"
              >
                <Plus className="h-4 w-4" />
                Add a Spot
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredSpots.map((spot) => (
                <SpotCard key={spot.id} spot={spot} variant="vertical" />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Floating add button */}
      <Link to="/app/add-spot"
        className="fixed bottom-20 right-4 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg shadow-primary/30 flex items-center justify-center hover:bg-primary/90 transition-all hover:scale-105 z-40"
        aria-label="Add a spot"
      >
        <Plus className="h-6 w-6" />
      </Link>

      <BottomNav />
    </div>
  )
}
