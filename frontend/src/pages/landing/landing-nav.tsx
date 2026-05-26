"use client"


import { Link } from "react-router-dom"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export function LandingNav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        <Link to="/" className="flex items-center gap-2 font-extrabold text-lg text-foreground">
          <span>Spoonful</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
          <a href="#for-businesses" className="hover:text-foreground transition-colors">For Businesses</a>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="text-sm font-semibold text-foreground hover:text-primary transition-colors px-4 py-2">
            Login
          </Link>
          <Link
            to="/signup"
            className="text-sm font-semibold bg-primary text-primary-foreground px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors"
          >
            Sign up
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-xl text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 flex flex-col gap-3">
          <a href="#how-it-works" className="text-sm font-medium text-muted-foreground py-2" onClick={() => setOpen(false)}>How it works</a>
          <a href="#for-businesses" className="text-sm font-medium text-muted-foreground py-2" onClick={() => setOpen(false)}>For Businesses</a>
          <hr className="border-border" />
          <Link to="/login" className="text-sm font-semibold text-center py-2.5 border border-border rounded-xl" onClick={() => setOpen(false)}>Login</Link>
          <Link to="/signup" className="text-sm font-semibold text-center py-2.5 bg-primary text-primary-foreground rounded-xl" onClick={() => setOpen(false)}>Sign up free</Link>
        </div>
      )}
    </header>
  )
}
