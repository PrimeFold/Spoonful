import { ForBusinesses } from "./for-businesses";
import { HeroSection } from "./hero-section";
import { HowItWorks } from "./how-it-works";
import { LandingFooter } from "./landing-footer";
import { LandingNav } from "./landing-nav";
import { WhySpoonful } from "./why-spoonful";


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      <main>
        <HeroSection />
        <HowItWorks />
        <WhySpoonful />
        <ForBusinesses />
      </main>
      <LandingFooter />
    </div>
  )
}
