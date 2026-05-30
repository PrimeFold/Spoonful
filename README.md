# Spoonful 

> **Every good meal near you, found.**

Spoonful is a community-driven food discovery app for college students — find affordable dhabas, tiffin services, and hidden local gems near your campus that never make it onto Zomato. Built by students, for students.

---

## The Problem

Zomato is for people who can afford ₹200 delivery fees. The best food near any Indian college — the ₹80 dinner thali  , the late-night dhaba, the tiffin service everyone swears by — exists nowhere online. You find it by asking a senior. Spoonful fixes that.

---

## Features

- **Discover Local Spots** — Find affordable food outlets near your college that aren't on any mainstream app
- **Community Reviews** — Students add places, rate them, and tag them so others can find them
- **Smart Tags** — Filter by "under ₹100", "open late", "good thali", "home-style food", and more
- **Map View** — See all nearby spots pinned on a map relative to your college/hostel
- **AI Recommendations** — Weekly "what's good near you" based on recent ratings and your taste preferences
- **Claim Your Listing** — Local businesses can claim and manage their listing
- **PWA Support** — Install on your phone like a native app, no App Store needed

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, TypeScript, Vite, shadcn/ui |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL + Prisma |
| Auth | Better Auth (GitHub OAuth / Email) |
| AI | Gemini Flash (recommendations) |
| Maps | Google Maps API / Mapbox |
| Payments | Stripe (business listings) |

---

## How It Works

1. Sign up and set your college/location
2. Browse nearby food spots on a map or list view
3. Filter by budget, tags, or rating
4. Add a place you know, rate it, tag it
5. Help the next fresher eat well on day one

---

## V1 Scope

- [ ] Auth (sign up / log in)
- [ ] Set college/location on onboarding
- [ ] Add a food spot (name, location, price range, tags, photo)
- [ ] View nearby spots in list + map view
- [ ] Rate and review a spothttps://github.com/PrimeFold/Spoonful/blob/main/README.md
- [ ] Basic tag filtering
- [ ] PWA manifest + installable on Android

---

## Roadmap

- [ ] AI-powered weekly recommendations
- [ ] Business claim and promote listing (Stripe)
- [ ] Verified student badge
- [ ] College-specific leaderboard (most reviewed spots)
- [ ] Mess/tiffin subscription tracker
- [ ] Notification when a new spot is added near you

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- Google Maps API key

### Installation

```bash
git clone https://github.com/yourusername/spoonful.git
cd spoonful

cd server && npm install
cd ../client && npm install
```

### Environment Variables

Create a `.env` in `/server`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/spoonful
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
GOOGLE_MAPS_API_KEY=your_maps_key
GEMINI_API_KEY=your_gemini_key
STRIPE_SECRET_KEY=your_stripe_key
CLIENT_URL=http://localhost:5173
```

### Run Locally

```bash
# Backend
cd server && npm run dev

# Frontend
cd client && npm run dev
```

---

## Monetization

| Plan | Features | Price |
|------|----------|-------|
| Free (Students) | Full discovery, add/rate spots | ₹0 |
| Business Listing | Claim + promote your outlet to nearby students | ₹199/mo |

---

## Contributing

PRs welcome. Open an issue first for major changes.

---

## License

[MIT](LICENSE)
