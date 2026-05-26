
import { Link } from "react-router-dom";

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-card py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <Link to="/" className="flex items-center gap-2 font-extrabold text-lg text-foreground mb-1">
              <span>🥄</span>
              <span>Spoonful</span>
            </Link>
            <p className="text-sm text-muted-foreground">Every good meal near you, found.</p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
            <Link to="/for-businesses" className="hover:text-foreground transition-colors">For Businesses</Link>
            <Link to="/signup" className="hover:text-foreground transition-colors">Sign up</Link>
            <Link to="/login" className="hover:text-foreground transition-colors">Login</Link>
          </nav>
        </div>
        <div className="mt-8 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          © 2025 Spoonful. Made with love for hungry students everywhere.
        </div>
      </div>
    </footer>
  )
}
