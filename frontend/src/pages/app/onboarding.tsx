import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronRight, ChevronLeft, Check } from "lucide-react"
import { cn } from "../../../lib/utils"

const COLLEGES = [
  "IIT Bombay", "IIT Delhi", "IIT Madras", "BITS Pilani", "NIT Trichy",
  "Christ University", "Mount Carmel College", "Manipal Institute", "VIT Vellore", "RVCE Bangalore",
]

const FOOD_PREFERENCES = [
  "Veg only", "North Indian", "South Indian", "Snacks", "Tiffin", "Late night", "Budget under ₹100", "Chinese", "Egg allowed",
]

const TOTAL_STEPS = 3

export default function OnboardingPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [college, setCollege] = useState("")
  const [collegeQuery, setCollegeQuery] = useState("")
  const [area, setArea] = useState("")
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>([])

  const filteredColleges = COLLEGES.filter((c) =>
    c.toLowerCase().includes(collegeQuery.toLowerCase())
  )

  const togglePref = (pref: string) => {
    setSelectedPrefs((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    )
  }

  const canProceed = () => {
    if (step === 1) return college.length > 0
    if (step === 2) return area.trim().length > 0
    return true
  }

  const handleNext = () => {
    if (step < TOTAL_STEPS) setStep(step + 1)
    else navigate("/app/home")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-10">
      {/* Logo */}
      <div className="flex items-center gap-2 font-extrabold text-lg text-foreground mb-8">
        <span className="text-xl">🥄</span>
        <span>Spoonful</span>
      </div>

      {/* Progress */}
      <div className="w-full max-w-sm mb-6">
        <div className="flex items-center gap-2 mb-2">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "flex-1 h-1.5 rounded-full transition-all",
                i + 1 <= step ? "bg-primary" : "bg-border"
              )}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground font-medium">Step {step} of {TOTAL_STEPS}</p>
      </div>

      <div className="w-full max-w-sm bg-card rounded-3xl border border-border shadow-sm p-7">

        {/* Step 1: College */}
        {step === 1 && (
          <div>
            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Let&apos;s get started</p>
            <h2 className="text-2xl font-extrabold text-foreground mb-1 text-balance">
              What&apos;s your college?
            </h2>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
              We&apos;ll find the best spots near your campus.
            </p>
            <input
              type="text"
              placeholder="Search your college..."
              value={collegeQuery}
              onChange={(e) => setCollegeQuery(e.target.value)}
              className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 mb-3"
            />
            <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
              {filteredColleges.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => { setCollege(c); setCollegeQuery(c) }}
                  className={cn(
                    "text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all border",
                    college === c
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-transparent hover:bg-secondary text-foreground"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Area */}
        {step === 2 && (
          <div>
            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Almost there</p>
            <h2 className="text-2xl font-extrabold text-foreground mb-1 text-balance">
              What area are you in?
            </h2>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
              Your neighbourhood helps us show you the closest gems.
            </p>
            <input
              type="text"
              placeholder="e.g. Koramangala, BTM Layout..."
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <p className="text-xs text-muted-foreground mt-2">Your locality or area near campus</p>
          </div>
        )}

        {/* Step 3: Preferences */}
        {step === 3 && (
          <div>
            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">One last thing</p>
            <h2 className="text-2xl font-extrabold text-foreground mb-1 text-balance">
              What do you like to eat?
            </h2>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
              Pick as many as you like — we&apos;ll personalise your feed.
            </p>
            <div className="flex flex-wrap gap-2">
              {FOOD_PREFERENCES.map((pref) => {
                const selected = selectedPrefs.includes(pref)
                return (
                  <button
                    key={pref}
                    type="button"
                    onClick={() => togglePref(pref)}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium border transition-all",
                      selected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-foreground border-border hover:bg-secondary"
                    )}
                  >
                    {selected && <Check className="h-3 w-3" />}
                    {pref}
                  </button>
                )
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              You can always update this in your profile settings.
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center gap-3 mt-8">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1 px-4 py-3 rounded-2xl border border-border text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
          )}
          <button
            type="button"
            onClick={handleNext}
            disabled={!canProceed()}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-all",
              canProceed()
                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            {step === TOTAL_STEPS ? "Let's eat!" : "Continue"}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
