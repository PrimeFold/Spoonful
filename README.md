# Spoonful

Spoonful is a student-focused food discovery app built as a learning project. The idea is simple: help people find nearby food spots, browse what others have shared, and add places they think are worth checking out.

The project is still small in scope and intentionally practical. It is not meant to look like a polished startup product, and the README reflects that.

---

## What It Does

- Browse a list of food spots
- Search spots by name, area, or dish
- Filter by tags and ratings
- Add a new food spot
- Rate and review spots
- Sign up, log in, and verify an account
- View your own submitted spots
- Access role-based admin and owner routes for moderation and management

---

## Project Structure

- `frontend` - React + TypeScript app built with Vite
- `backend` - Express + TypeScript API
- `shared` - Shared types used by both sides

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite |
| UI | Tailwind CSS, shadcn/ui, Radix UI |
| State/Data | React Query |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL + Prisma |
| Auth | Better Auth |
| Email | Nodemailer |
| Validation | Zod |
| Caching / Support Tools | Redis, rate limiting, Helmet |

---

## Main Screens

- Landing page
- Login and signup
- Email verification
- Home feed
- Search page
- Add spot page
- Profile page
- Admin verification page
- Owner dashboard

---

## Role-Based Access

The app includes basic role-based routing on the backend.

- `STUDENT` users can browse, search, add spots, and review places
- `ADMIN` users can review pending food spots and verify them
- `OWNER` users can access higher-level admin management routes

This is part of the learning project setup and may have bugs

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- A `.env` file for the backend

### Install

Install dependencies in both apps:

```bash
cd backend
npm install

cd ../frontend
npm install
```

### Environment Variables

Backend environment variables are configured separately. The exact names may change as the project evolves, but the backend currently expects values for:

- database connection
- auth secrets
- email transport
- rate limiting / cache support

Check the backend source before setting up a fresh environment, since this is a work-in-progress project.

### Run Locally

```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

---

## Notes

- This is a learning project, so some flows are still rough around the edges
- Some routes and labels are still being cleaned up
- The codebase includes admin and owner sections, but the focus is still on the student experience

---

## Development

Useful scripts:

### Backend

- `npm run dev`
- `npm run build`
- `npm run type-check`

### Frontend

- `npm run dev`
- `npm run build`
- `npm run lint`

---

## License

MIT
