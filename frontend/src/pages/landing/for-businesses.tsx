
import { Link } from "react-router-dom";
export function ForBusinesses() {
  return (
    <section id="for-businesses" className="py-16 px-4 bg-primary/5">
      <div className="max-w-3xl mx-auto text-center">
        <span className="inline-block text-3xl mb-4">🏪</span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4 text-balance">
          Own a food spot near a campus?
        </h2>
        <p className="text-muted-foreground text-base leading-relaxed mb-8 max-w-xl mx-auto">
          Get discovered by thousands of hungry students near your college. List your place on Spoonful and let the community find you.
        </p>
        <div className="grid sm:grid-cols-3 gap-4 mb-10 text-left">
          {[
            { icon: "✅", title: "Verified badge", desc: "Build trust with a verified listing" },
            { icon: "📈", title: "Priority search", desc: "Show up first for relevant searches" },
            { icon: "💬", title: "Respond to reviews", desc: "Engage with your student customers" },
          ].map((f) => (
            <div key={f.title} className="bg-card rounded-2xl p-4 border border-border">
              <span className="text-2xl">{f.icon}</span>
              <p className="font-bold text-sm text-foreground mt-2 mb-1">{f.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
        <Link
          to="/for-businesses"
          className="inline-flex items-center justify-center gap-2 bg-foreground text-background font-bold px-8 py-3.5 rounded-2xl hover:bg-foreground/90 transition-colors text-sm"
        >
          List your place — ₹199/month
        </Link>
      </div>
    </section>
  )
}
