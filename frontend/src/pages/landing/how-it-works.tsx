const steps = [
  {
    icon: "🎓",
    step: "01",
    title: "Set your college",
    description: "Tell us which campus you study at and we'll find spots nearby.",
  },
  {
    icon: "🗺️",
    step: "02",
    title: "Browse local spots",
    description: "Explore hidden gems — tiny dhabas, tiffin aunties, and chai corners not on any delivery app.",
  },
  {
    icon: "🍛",
    step: "03",
    title: "Eat well, spend less",
    description: "Real food, real prices, real reviews from students who eat there every day.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 px-4 bg-secondary/40">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3 text-balance">
            How it works
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
            Getting started takes less than a minute.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div key={s.step} className="bg-card rounded-2xl p-6 border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{s.icon}</span>
                <span className="text-xs font-extrabold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                  Step {s.step}
                </span>
              </div>
              <h3 className="font-extrabold text-lg text-foreground mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
