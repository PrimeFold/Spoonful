import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Check } from "lucide-react"
import { cn } from "../../../lib/utils"

const FEATURES = [
  { icon: "✅", title: "Verified badge", desc: "Stand out with a trust badge. Students love verified spots." },
  { icon: "📈", title: "Priority in search", desc: "Get featured first when students search near your location." },
  { icon: "💬", title: "Respond to reviews", desc: "Engage with your customers and build loyalty." },
  { icon: "📊", title: "Analytics dashboard", desc: "See how many students view and save your listing each week." },
]

export default function ForBusinessesPage() {
  const [form, setForm] = useState({ name: "", spotName: "", area: "", phone: "", message: "" })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal nav */}
      <header className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-extrabold text-lg text-foreground">
            <span>🥄</span>
            <span>Spoonful</span>
          </Link>
          <Link to="/" className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <span className="text-5xl block mb-4">🏪</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4 text-balance">
            Get discovered by thousands of students near your college
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed max-w-xl mx-auto">
            Spoonful helps local food spots get found by students who are actively looking for affordable meals.
            No commissions, no delivery hassle — just discovery.
          </p>
        </div>

        {/* Pricing */}
        <div className="bg-primary/5 border-2 border-primary/20 rounded-3xl p-7 text-center mb-10">
          <p className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Simple pricing</p>
          <div className="flex items-end justify-center gap-1 mb-1">
            <span className="text-5xl font-extrabold text-foreground">₹199</span>
            <span className="text-lg text-muted-foreground mb-2">/month</span>
          </div>
          <p className="text-sm text-muted-foreground mb-5">Cancel anytime. No hidden fees.</p>
          <div className="grid sm:grid-cols-2 gap-2 text-left max-w-md mx-auto">
            {["Verified listing badge", "Priority search placement", "Respond to reviews", "Weekly analytics report"].map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Check className="h-4 w-4 text-primary flex-shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-card rounded-2xl border border-border p-5">
              <span className="text-2xl">{f.icon}</span>
              <h3 className="font-extrabold text-base text-foreground mt-3 mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Contact form */}
        <div className="bg-card rounded-3xl border border-border p-7">
          {submitted ? (
            <div className="text-center py-6">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="font-extrabold text-xl text-foreground mb-2">We&apos;ll be in touch!</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our team will reach out within 24 hours to get your listing set up.
              </p>
            </div>
          ) : (
            <>
              <h2 className="font-extrabold text-xl text-foreground mb-1">Claim your listing</h2>
              <p className="text-sm text-muted-foreground mb-6">Fill this in and we&apos;ll set you up within 24 hours.</p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="owner-name" className="block text-sm font-bold text-foreground mb-1.5">Your name</label>
                    <input
                      id="owner-name"
                      required
                      type="text"
                      placeholder="Rajesh Kumar"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label htmlFor="spot-name" className="block text-sm font-bold text-foreground mb-1.5">Spot name</label>
                    <input
                      id="spot-name"
                      required
                      type="text"
                      placeholder="Your restaurant name"
                      value={form.spotName}
                      onChange={(e) => setForm({ ...form, spotName: e.target.value })}
                      className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="biz-area" className="block text-sm font-bold text-foreground mb-1.5">Area / Locality</label>
                    <input
                      id="biz-area"
                      required
                      type="text"
                      placeholder="Koramangala"
                      value={form.area}
                      onChange={(e) => setForm({ ...form, area: e.target.value })}
                      className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label htmlFor="biz-phone" className="block text-sm font-bold text-foreground mb-1.5">Phone number</label>
                    <input
                      id="biz-phone"
                      required
                      type="tel"
                      placeholder="+91 9876543210"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="biz-message" className="block text-sm font-bold text-foreground mb-1.5">
                    Anything else? <span className="font-normal text-muted-foreground">(optional)</span>
                  </label>
                  <textarea
                    id="biz-message"
                    rows={3}
                    placeholder="Tell us about your place..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className={cn("w-full bg-foreground text-background font-bold py-4 rounded-2xl hover:bg-foreground/90 transition-colors text-sm")}
                >
                  Claim your listing — ₹199/month
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
