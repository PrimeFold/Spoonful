import { Link } from "react-router-dom"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center">
      <div className="text-7xl mb-6">🍽️</div>
      <h1 className="text-3xl font-extrabold text-foreground mb-3 text-balance">
        Looks like this spot doesn&apos;t exist... yet.
      </h1>
      <p className="text-muted-foreground text-base leading-relaxed max-w-xs mb-8">
        Maybe it&apos;s a hidden gem waiting to be discovered. Be the first to add it!
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/app/add-spot"
          className="inline-flex items-center justify-center bg-primary text-primary-foreground font-bold px-6 py-3.5 rounded-2xl hover:bg-primary/90 transition-colors text-sm shadow-sm shadow-primary/20"
        >
          Add this spot
        </Link>
        <Link
          to="/app/home"
          className="inline-flex items-center justify-center bg-card border border-border text-foreground font-semibold px-6 py-3.5 rounded-2xl hover:bg-secondary transition-colors text-sm"
        >
          Back to feed
        </Link>
      </div>
      <p className="mt-8 text-xs text-muted-foreground">Error 404 · Spoonful</p>
    </div>
  )
}
