import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-14 md:py-20 px-4">
      {/* Warm background blobs */}
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        <div className="flex flex-col md:flex-row items-center gap-10">
          {/* Text side */}
          <div className="flex-1 text-center md:text-left">
            <span className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
              Student-first food discovery
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight text-balance mb-5">
              Every good meal<br className="hidden md:block" />{" "}
              <span className="text-primary">near you, found.</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-md mx-auto md:mx-0 mb-8">
              Discover affordable local food spots near your campus that aren&apos;t on Zomato.
              Real recommendations from students, for students.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold px-6 py-3.5 rounded-2xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 text-sm"
              >
                Find Food Near Me
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 bg-card text-foreground font-semibold px-6 py-3.5 rounded-2xl hover:bg-secondary transition-colors border border-border text-sm"
              >
                Add a Spot
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-4 mt-8 justify-center md:justify-start">
              <div className="flex -space-x-2">
                {["bg-primary/80", "bg-accent/80", "bg-secondary-foreground/30"].map((c, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-background ${c} flex items-center justify-center text-xs font-bold text-card`}>
                    {["A", "P", "R"][i]}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-bold text-foreground">2,400+</span> students eating well
              </p>
            </div>
          </div>

          {/* Visual side */}
          <div className="flex-1 flex justify-center md:justify-end">
            <div className="relative w-full max-w-sm">
              {/* Phone mockup */}
              <div className="bg-card rounded-3xl border-2 border-border shadow-2xl overflow-hidden p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Good afternoon, Rahul</p>
                    <p className="font-bold text-foreground">What&apos;s for lunch? 🌤️</p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">R</div>
                </div>
                <div className="bg-secondary rounded-2xl px-3 py-2.5 flex items-center gap-2 mb-4">
                  <span className="text-muted-foreground text-sm">🔍 Search spots, dishes, areas...</span>
                </div>
                {/* Mini spot cards */}
                {[
                  { name: "Mama Tiffin Centre", area: "Koramangala", rating: "4.8", price: "₹", tag: "Home Style" },
                  { name: "Udupi Express", area: "BTM Layout", rating: "4.9", price: "₹₹", tag: "South Indian" },
                ].map((s) => (
                  <div key={s.name} className="flex items-center gap-3 bg-muted rounded-2xl p-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-xl flex-shrink-0">🍽️</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.area} · {s.price}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-foreground bg-card px-2 py-1 rounded-lg">
                      ⭐ {s.rating}
                    </div>
                  </div>
                ))}
                <div className="flex gap-2 mt-3">
                  {["Under ₹100", "Open Late", "Good Thali", "Veg"].map((t) => (
                    <span key={t} className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground whitespace-nowrap">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
