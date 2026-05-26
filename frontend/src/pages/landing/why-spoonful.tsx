const valueProps = [
  {
    icon: "💸",
    title: "Student budget focused",
    description: "Every spot is rated on value. Filter for meals under ₹100 — no compromise on taste.",
  },
  {
    icon: "🤝",
    title: "Community driven",
    description: "Reviews come from real students. No paid promotions, no inflated ratings.",
  },
  {
    icon: "🚫",
    title: "No delivery fees",
    description: "Walk in, eat fresh. We help you discover places worth walking to.",
  },
  {
    icon: "💎",
    title: "Hidden gems only",
    description: "If it is on Zomato already, it probably doesn't need our help. We surface the rest.",
  },
]

export function WhySpoonful() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3 text-balance">
            Why Spoonful?
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
            Built by students who got tired of eating overpriced, mediocre food.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {valueProps.map((v) => (
            <div key={v.title} className="flex gap-4 bg-card rounded-2xl p-5 border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl flex-shrink-0">
                {v.icon}
              </div>
              <div>
                <h3 className="font-extrabold text-base text-foreground mb-1">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
