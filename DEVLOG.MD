# Spoonfull

## Devlog..
- I'll document stuff about my journey during developing this project and debugging till proper functioning..

## Day-1 (25/05/2026)

- Created reposistory and did the basic stuff such as : 

* Added a README.MD
* Implemented basic express server.


## Day-2 (26/05/2026)

- Spent a lot of time adding & refining ui and fixing package dependency bugs , and added helper functions + necessary types. 

## Day-3 (28/05/2026)

- Today's goal is to sort of get the dashboard working barebones - For that I need to Get some backend stuff done such as:

   - api end-points
   - getting food-spot by id
   - Adding OTP verification system through email ( probably gonna use nodemailer since I don't have a domain yet ).
   - Added axios instance to hit OTP verification end-point
   - Verification will be in the form of POST-LOGIN.
   
- Was working on 27th May as well but didn't commit as such , anyways , wrote some functions for food spot controller.
- It was a little complex for me to implement the search filter and just overall feed-like fetch ( which is easy but due to filter logic I was confused ).
- Fixed some migration issues , had to reset the db and migrate again , took a fair toll of time.

# Day-4 (29/05/2026)

- Today's goal is to 
 * Fix bugs of last day.
 * Get the filtering logic done on the frontend so its seamless with the backend. 
 * Make sure data flows into the home page nicely , then we'll focus on 'adding food spots' aspect.

## Questions that I had and Answers that I got : 

- There was a question that "Why should I not just filter data on the frontend ? , just retrieve everything and filter based on user filter params ". Then I realised that large amoutn of JS sent over the network will produce issues like - 
   * Larger hydration cost
   * More JS memory usage
   * More React work
   * Slower mobile performance
   * Worse Core Web Vitals
- So I had to add the filter logic on the backend , so the app only retrieves what's asked. And ofcourse pagination will be implemented soon .

## Bugs : 

- Fixed some bugs today:

   * Session hook should've been on the top 
   * Added dependency array to the useEffect or it would re-run on ever render.
   * Added proper checks for the data , making sure its in the form of an array.
   * setMeal() and setTimeOfDay() were called during render, causing infinite re-renders.
   * Date.now() was used incorrectly. It returns milliseconds, not current hour.
   * user?.name.charAt(0) could still throw if name is undefined.
   * No loading state handling before rendering fetched data.
   * No proper error UI for failed queries.
   * useState<User>() || null is invalid logic and unnecessary.
   * Query response shape was assumed blindly instead of safely handled.
   * isLoading from React Query existed but wasn’t actually used.
   * activeFilter exists but filter pills UI doesn’t yet update it. The section was decorative cardboard pretending to be functionality.

## Extras : 
- Added QueryClientProvider and wrapped it around the app.
- Added ONE global instance for the useQueryClient hook.


# Day-6 (30/05/2026)

- Today I'll be making optimizations in my code : 
   * Duplicated where clause , unified them.
   * Preparing pagination on the backend and frontend ( maybe not today ).
   * Improving redis caching logic so that pagination don't mess up the cache stored. As of now it only stores the search metadata , but what if the user does the same search on being other than the page he was on? The backend should return THAT page's content . 
   * Improved data shape from backend and making sure the same shape is received on the frontend as well.
   * Added GET route for getting all food spots.
   * Some fixes in pagination on the frontend , implemented ui for that as well.

# Day-7 (01/06/2026)

- Debugging the food spot feed request and request validation:
   * Cleaned frontend GET params so blank `search` is not sent as `search=`.
   * Updated backend query validation to ignore empty search strings and handle optional filters correctly.
   * Confirmed the route is protected, so proper session/auth headers are required for `/app/get-food-spots`.
   * Solution found ! : 'skip' calculation was correct but when `skip=0` , it returns an error but `skip=0` is correct for `page=1`. Removed that validation in order to fix the issue.

- Built the logic to get user's own submissions i.e Food-spots that he submitted.
   * Added an endpoint `/app/get-my-food-spots`.
   * Added a controller and service function for the same.
   * Prepared a helper function on the frontend.
   * Added function calling and proper data flow. 
- Added ui adjustments to make site responsive for both large and small screens


# Day-8 (05/06/2026)

- Prepared `spot-card` or the spot details interface.
   * Added querys & helper functions for the same.
## Bugs : 
- Had a bug where adding food spot just throws `added foot spot` success message but actually it didn't.
- Some React rendering issue faced.
- I added a ton of logs to see what was the actual bottleneck , turns out it was 2 things :
   1. Maybe the data coming from the frontend was not type-safe so it was undefined.
   2. I was sending the data from frontend but it wasn't an object `data` , and on the backend I was destructuring it . 
   3. ( For react rendering issue ) - 
## Fixes : 
   1. Added a zod validation schema so that data coming from the frontend is type safe and in proper shape.
   2. Removed that destructrig , resulting in success.


# Day-9 (06/06/2026)

- Thinking of polishing more stuff as of now.
   * Would have a 'city-state' validity check cause as of now anybody could enter any imagninary or wrong city for any state. 
- Adding RBAC : 
   * Added admin , owner functions.


# Day-10 (10/06/2026)
- Today I'll be adding UI/UX for the admins.
- Not much to do honestly.


# Day-11 (11/06/2026)
- Today I prepared the verification page , queries and mutations.
- Wrote helper functions as well as modified some types to get user id.
- Tomorrow I'd be preparing the OWNER dashboard and respective functions.


# Day-12 (12/06/2026)

- Built the OWNER dashboard end-to-end.
- What I added on the backend:

  - Added paginated owner-facing routes for:
    - pending food spots
    - all admins
    - students
  - Wired controller + service + repository functions for:
    - fetching all admins
    - fetching students with pagination and search
    - promoting a student to admin
    - demoting an admin back to student
  - Added pagination support for the pending food-spots list so the owner queue behaves consistently with the rest of the app.
  - Fixed route protection by making sure role-protected routes still go through `authMiddleware` before `requireRole`.
  - Kept the role mutation logic safe by only allowing:
    - `STUDENT -> ADMIN`
    - `ADMIN -> STUDENT`
  - Updated the food-spot DTO mapper so the owner queue can show timestamps and the submitted-by details properly.

- What I added on the frontend:

  - Created a new owner dashboard page.
  - Added UI sections for:
    - food spots being added
    - interactable admins list
    - interactable students list
  - Added pagination controls for the student list.
  - Added optimistic updates with TanStack Query for:
    - promoting a student
    - demoting an admin
  - Added frontend helper functions in `actions.ts` for the new owner endpoints.
  - Added owner navigation support in the navbar.
  - Added the owner route in the app router.

- Cleanup / fixes:
  - Updated the existing admin verification flow to match the corrected API shape.
  - Fixed pending spot route usage so owner/admin UI calls the right endpoints.
  - Ran type checks on both frontend and backend to confirm the implementation is wired correctly.
  - Reworked the search page to use the real food-spot API instead of mock data.
  - Added responsive search UI, tag filters, pagination, and smoother loading states.
  - Cleaned up the spot detail page so it handles missing IDs, loading, error, and empty states properly.
  - Added small Redis caching for the admin pending queue and invalidated it after verification so the queue stays fresh.
  - Standardized the API response types in a shared file so frontend and backend speak the same shape.
  - Replaced a few hard loaders with lightweight skeletons so the app feels faster while data is loading.


# Day-13 (16/06/2026)

Today was a heavy debugging session end-to-end across auth, Prisma, and routing. Here's every problem faced and how it was solved.

---

## Bug 1 — 401 on `/otp/generate` (OTP never sent)

**Problem:**
After a successful sign-in, the app tried to call `/otp/generate` to send the verification email. This threw a `401 Unauthorized` even though the user was signed in.

**Root cause:**
The backend OTP controller calls `auth.api.getSession({ headers: req.headers })` to verify the session. For this to work, the browser must send the session cookie with the request. The cookie was configured with `secure: true` and `sameSite: "none"` in the backend auth config. In a local dev environment running on plain `http://`, the browser **silently drops** `secure` cookies — they can only be sent over HTTPS. So the cookie was never attached, and the backend saw no session, hence `401`.

**Fix:**
In `auth.ts`, set `secure` and `sameSite` conditionally:
```ts
sameSite: process.env.NODE_ENV === 'production' ? "none" : "lax",
secure: process.env.NODE_ENV === 'production',
```
In dev, `lax` + non-secure allows the cookie to travel over HTTP between the frontend (`localhost:5173`) and backend (`localhost:3000`).

---

## Bug 2 — React hook called inside event handler (login silently broken)

**Problem:**
`authClient.useSession()` was called inside the `handleSubmit` event handler in `login.tsx`. This violates the **Rules of Hooks** — hooks can only be called at the top level of a component, not inside callbacks, conditionals, or event handlers.

**Root cause:**
Because the hook was called in a non-hook context, it either threw silently or returned stale/undefined data. The `user` object was always `undefined`, so the email-verified check never ran correctly and navigation never happened after login.

**Fix:**
Read the `user` directly from the `signIn()` response object (`response.data.user`) instead of calling `useSession()` again. The sign-in response already contains the full user object from better-auth.

---

## Bug 3 — 400 on `GET /app/get-food-spots` after login

**Problem:**
After a successful login, the home page tried to fetch food spots and got a `400 Bad Request`. Looking at the error, Prisma was throwing:
```
The column `FoodSpots.createdAt` does not exist in the current database.
```

**Root cause:**
`FOOD_SPOT_SELECT` in `fs.repository.ts` includes `createdAt: true`. The `schema.prisma` file had the `createdAt DateTime @default(now())` field on the `FoodSpots` model, but **no migration had ever been run to actually add it to the PostgreSQL table**. The generated Prisma client was also stale and didn't include `createdAt` in its `FoodSpotsSelect` type. Every `findMany` call threw a Prisma runtime error, which `fs.service.ts` caught and returned as `success: false`, which the controller converted to a `400`.

**Fix:**
```bash
npx prisma migrate dev --name add_createdat_to_foodspots
npx prisma generate
```
The migration added the column to the DB, and `generate` updated the Prisma client types. The `tsx --watch` dev server hot-reloaded and picked up the new client automatically.

**Lesson:** Whenever you add a field to `schema.prisma`, always immediately run `prisma migrate dev` (or `prisma db push` in early dev). A schema drift between the file and the real DB is silent at the TypeScript level but explodes at runtime.

---

## Bug 4 — Owner and Admin users land on the regular home page after login

**Problem:**
Accounts with `role: OWNER` or `role: ADMIN` were being routed to `/app/home` (the student feed) after login. There was no role-based routing logic.

**Root cause (part 1) — Role not in session:**
`better-auth` only returns standard fields (`id`, `name`, `email`, `emailVerified`, `image`) in the session by default. The `role` field from the `User` model was never included in the session response, so the frontend had no way to read it.

**Fix:** Add `user.additionalFields` to `auth.ts` on the backend:
```ts
user: {
  additionalFields: {
    role: { type: "string", defaultValue: "STUDENT", input: false },
  },
},
```
And use `inferAdditionalFields` plugin in the frontend `createAuthClient()` so the TypeScript type also reflects the `role` property.

**Root cause (part 2) — No role-based redirect in login:**
`login.tsx` always called `navigate("/app/home")` regardless of role.

**Fix:** After sign-in, read `role` from the response user object and route accordingly:
- `OWNER` → `/owner/dashboard`
- `ADMIN` → `/admin/dashboard`
- `STUDENT` → `/app/home`

**Root cause (part 3) — Admin dashboard was fatally broken:**
`AdminDashboard` was importing `useParams` and doing:
```ts
const { id } = useParams();
if (!id) return toast.error("Id not found!") // ← returns void, not JSX!
```
`toast.error()` returns `void`, not a React element. This caused the component to return nothing on every render (since `/admin/dashboard` has no `:id` param), making the page permanently blank with no error.

**Fix:** Removed the `useParams` pattern entirely — the admin dashboard is a standalone page that fetches all pending spots globally; it doesn't need a URL param. Also added the missing `/admin/dashboard` route to `App.tsx`.

---

## Day-13 Updates (Continued)

### 1. Fix `inferAdditionalFields` Import Error
- **Problem:** `Module '"better-auth/react"' has no exported member 'inferAdditionalFields'` error in frontend `lib/auth.ts`.
- **Root Cause:** In `better-auth`, `inferAdditionalFields` is exported from the client plugins package `better-auth/client/plugins`, not `better-auth/react`.
- **Fix:** Corrected the import path to `import { inferAdditionalFields } from "better-auth/client/plugins";`.

### 2. Separated Owner and Admin Responsibilities
- **Problem:** The owner console had a "Food spots being added" section for reviewing food spots, which is a responsibility meant exclusively for **Admins**, not the Owner (who only manages Admins).
- **Fix:**
  - Removed the `GetOwnerPendingFoodSpots` query and all pending review UI cards and stats from the Owner dashboard (`OwnerDashboard` in `owner/dashboard.tsx`).
  - Removed the `GET /owner/food-spots/pending` route from the backend `route.ts`.

### 3. Integrated Double-Sided Flow Switcher (Console Toggle)
- **Problem:** When an Admin or Owner logged in, they were forced into their dashboard view and could not see the student home page (`/app/home`). Clicking "Home" on the bottom navigation would take them back to the student homepage, but they would have no way to get back to their dashboard.
- **Fix:**
  - Updated the global `Navbar` component to fetch the logged-in user session and role.
  - If the user is an `ADMIN` or `OWNER`, they will see an **"Admin Panel"** or **"Owner Panel"** badge in the navbar when browsing student pages (Home, Search, Profile).
  - When viewing their respective dashboards, they will see a **"Student View"** button in the navbar to quickly return to the regular application view.
  - This provides a neat, properly labeled, and completely transparent flow to switch views without any misleading elements.

### 4. Toast Notifications Silently Broken
- **Problem:** When validation failed or errors occurred, `toast.error()` was called but nothing was rendered on screen.
- **Root Cause:** The `<Toaster />` context provider component from `react-hot-toast` was never rendered anywhere in the application tree.
- **Fix:** Added `<Toaster position="top-center" />` inside the root `<BrowserRouter>` wrapper in `App.tsx`.

### 5. Lack of Inline Authentication Feedback
- **Problem:** If a user typed a wrong password or email, they had to rely solely on toast popups, and the auth forms themselves did not display any responsive inline visual feedback.
- **Fix:** Created a local `errorMsg` state in `login.tsx`, `signup.tsx`, `pass-reset-email.tsx`, and `reset-password.tsx`. Hitting an error now mounts a styled red alert banner (`bg-red-500/10 text-red-500`) directly above the form fields with smooth entrance animations.

### 6. Password Reset Email Displaying Raw HTML Code
- **Problem:** Email clients received raw text displaying tags like `<p>` and `<a>` instead of rendering standard styled components.
- **Root Cause:** In the backend `auth.ts`, the nodemailer transporter configuration used the `text:` field instead of the `html:` field.
- **Fix:** Switched the configuration to `html:` and designed a clean, modern HTML email template using inline responsive styling matching the Spoonful aesthetic.

### 7. Full-Screen Loader on Password Reset Request
- **Problem:** Hitting 'Next' on the password reset email request page replaced the entire form with a loader screen, and there was no state indicating the dispatch was successful.
- **Fix:** Refactored `pass-reset-email.tsx` to keep the form visible while placing a loading spinner directly inside the submit button. Added a new `emailSent` state that updates the button copy to "Email sent" and disables it once completed successfully.

### 8. Session Desync After Successful OTP Verification
- **Problem:** Immediately after a user successfully verified their OTP, navigating to `/app/home` was blocked or rejected because the client-side session store still cached the old `emailVerified: false` state.
- **Fix:** Updated the validation flow in `verification.tsx` to force refetch the user session using:
  ```typescript
  await authClient.getSession({ 
    query: { disableCookieCache: true } 
  });
  ```
  right before navigation, which updates the cookie cache immediately and syncs client-side authentication states.

---

# Day-14 (17/06/2026)

Today, I refactored the Admin and Owner dashboards, integrated Recharts for analytics, setup robust caching for fluid transitions, and ensured DB queries are completely separated.

## Key Changes:

### 1. Viewport-Constrained Layouts
- **Problem:** Dashboards scrolled past the window viewport, creating nested scroll bars and a generic, cheap look.
- **Fix:** Redesigned both the Admin and Owner dashboards with a strict viewport constraint (`h-screen overflow-hidden flex flex-col bg-background`). All sub-panels and detail lists scroll internally using flex growth, keeping the main page static and compact.

### 2. Smooth Analytics Transitions (Recharts AreaChart)
- **Problem:** Chart loaders caused page flickering when switching periods (Day/Week/Month).
- **Fix:** Swapped mock graphs for actual Recharts `AreaChart` components. Used `@tanstack/react-query`'s `placeholderData: keepPreviousData` strategy. Now, when toggling analytics periods, the existing graph is kept visible until new data resolves, animating the change smoothly without showing a flashing loader.

### 3. Logged Admin Actions
- **Problem:** The owner had no oversight of admin actions or which user submitted what food spot.
- **Fix:** 
  - Modified the spot verification endpoint to pass the `adminId` to the service.
  - Recorded a log in the database `AdminAction` table when a spot is approved or rejected by an admin.
  - Implemented `/owner/admin-actions` and `/owner/submitted-spots` endpoints.
  - Grouped them under the Owner dashboard with multi-tab cards (Admins list vs Admin Actions log; Students list vs Submitted Spots with submitter user details).

### 4. Code Splitting & Database Queries Separation
- **Problem:** Direct database operations were mixed within service functions, breaking standard repository separation patterns.
- **Fix:** Extracted all Prisma queries from `roles.service.ts` (such as the analytics creation dates query) into the dedicated `RolesRepository` inside `roles.repository.ts`, referencing them back inside service handlers.

### 5. Vite Rolldown Bundle Resolution Error
- **Problem:** Production build failed because Vite/Rolldown could not resolve the `"react-is"` import requested by `recharts`.
- **Fix:** Installed `"react-is"` as a direct dependency in the frontend `package.json`, which resolves bundler tree-shaking issues cleanly.

## Lessons Learnt:
- **KeepPreviousData**: When designing complex client dashboards, using `placeholderData: keepPreviousData` keeps the UI feeling instant and prevents layout shifts, providing a native-app feel.
- **Strict Viewport Containment**: Setting main sections to overflow-hidden and lists to overflow-y-auto ensures layouts don't bleed on smaller screens.
- **Repository Pattern Integrity**: Keeping all raw database query logic inside repository files keeps services clean, testable, and prevents database import conflicts.
- **Bundler Dependencies**: Modern bundlers (like Rolldown/Vite 8) are stricter with peer dependencies than older Webpack setups. Always run typecheck and build locally before deploying to catch missing sub-dependency issues early.



