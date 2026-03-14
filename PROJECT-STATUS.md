# VolunHub — Project Status

## Current State
Phases A, B, and C are complete. Phase D (polish) is next. The app is live on Netlify with continuous deployment from GitHub (main branch).

**⚠️ Remember before final submission:** Email confirmation is intentionally disabled (Supabase free tier = 2 emails/hour, too limiting for demos). Decision is final — no re-enable needed.

- **Local dev:** `npm run dev` → `http://localhost:5173`
- **GitHub:** https://github.com/aesheeds/volunhub-react-app
- **Netlify:** Deployed (auto-deploys on every push to main)
- **Working directory:** `d:/Users/shenu/Documents/Low No Code/Midterm Project/volunhub`

---

## Completed

### Infrastructure
- [x] React + Vite scaffolded, react-router-dom v7 installed
- [x] GitHub repo connected to Netlify, continuous deployment working
- [x] Seed logic in `App.jsx` — seeds `volunhub_events` from `events.json` on first load (only if key doesn't exist)

### Data & Storage
- [x] `src/data/events.json` — 20 sample events (Florida locations, varied causes/types/dates Apr–May 2026)
- [x] `useLocalStorage` hook — generic read/write abstraction, supports function updater pattern
- [x] `useSaved` hook — thin wrapper over `SavedContext`
- [x] `useSignups` hook — thin wrapper over `SignupsContext`

### Pages & Components
- [x] `Nav` — auth-aware: Home/My Signups/Agenda/Saved/Profile for logged-in users; Browse always visible; Log In for guests; mobile hamburger menu
- [x] `Browse` (`/`) — event grid sorted by date, collapsible FilterBar with multi-select pill toggles
- [x] `FilterBar` — search input + cause/location/type pill groups, active filter badge, "Clear all filters"
- [x] `EventCard` — cause/type tags, "✓ Signed Up" badge (blue), title, org, location, date, time, remaining spots, "Event Full" in red
- [x] `EventDetail` (`/events/:id`) — full info, Save + Sign Up buttons (redirect to /login if guest), inline note form, cancel signup with inline confirmation panel, remaining spots derived, back uses `navigate(-1)`
- [x] `Saved` (`/saved`) — saved events sorted by date, empty state message
- [x] `Signups` (`/signups`) — list view sorted by date, cancel with inline confirm, shows note, Edit Note inline
- [x] `Agenda` (`/agenda`) — weekly view with Prev/Next/This Week navigation, 7 day rows (Mon–Sun), Today badge, Cancel Signup with inline confirm

### Auth (Phase A — Complete)
- [x] `src/lib/supabase.js` — Supabase client
- [x] `useAuth` hook — `user`, `loading`, `signIn`, `signUp`, `signOut`
- [x] `Login` (`/login`) — redirects to `/home` on success
- [x] `SignUp` (`/signup`) — redirects to `/profile?welcome=true` on success; no email confirmation (intentional)
- [x] `ProtectedRoute` — redirects guests to `/login`, loading guard prevents flash
- [x] Protected routes: `/saved`, `/signups`, `/agenda`, `/home`, `/profile`

### Cloud DB (Phase B — Complete)
- [x] Supabase tables: `profiles`, `signups`, `saved_events` with RLS
- [x] `SignupsContext` — fetches once on auth resolve, shared across all pages
- [x] `SavedContext` — fetches once on auth resolve, shared across all pages
- [x] Data isolation verified between users

### Profile & Home (Phase C — Complete)
- [x] `ProfileContext` — fetches profile once on auth resolve, exposes `profile`, `loading`, `updateProfile`, `resetProfile`
- [x] `Profile` (`/profile`) — first/last name + preference pills (causes/locations/types), saves to Supabase via context, welcome banner on first signup, redirects to `/home` after new-user save, Log Out button, Clear My Data with inline confirmation (deletes profiles/signups/saved_events rows, hard reload to reset context state)
- [x] `Home` (`/home`) — personalized greeting, recommended events filtered by profile preferences, empty states for no-preferences and no-matches, "Browse all events" link
- [x] `profiles` table updated: `first_name` + `last_name` columns (replaced `display_name`)

---

## Step Tracker

| Step | Feature | Status |
|------|---------|--------|
| 9 | Agenda page — weekly view with navigation, cancel | ✅ Done |
| A1–A7 | Supabase Auth | ✅ Done |
| B1–B5 | Cloud DB migration + RLS + isolation test | ✅ Done |
| C1 | Profile page — first/last name + preference pills | ✅ Done |
| C2 | Save preferences to `profiles` table via ProfileContext | ✅ Done |
| C3 | Home page — recommended events by preference | ✅ Done |
| C4 | `/home` route + Nav order (Home · Browse · My Signups · Agenda · Saved · Profile) | ✅ Done |
| D1 | Style auth pages to match VolunHub design | 🔲 Next |
| D2 | Loading states / UX polish for async actions | 🔲 Next |
| D3 | Error handling — wrong password, email taken, etc. | 🔲 Next |
| D4 | Styling pass — fonts, images on EventDetail, mobile check | 🔲 Next |
| — | Profile picture upload (Supabase Storage) | 🔲 Deferred |

---

## Key Decisions Made This Session
- **Email confirmation disabled permanently** — Supabase free tier (2/hr limit) incompatible with demo/grading use. Auth account persists; data cleared separately via "Clear My Data".
- **Nav order:** Home · Browse · My Signups · Agenda · Saved · Profile
- **ProfileContext pattern** — mirrors SignupsContext/SavedContext; eliminates per-page fetch latency on Home and Profile
- **Signed-up badge on EventCard** — blue "✓ Signed Up" pill visible on Browse and Home grids
- **Cancel confirm on EventDetail** — inline panel below action buttons (matches Signups/Agenda pattern)
- **Saved moved after Agenda in nav** — Signups/Agenda are action-oriented; Saved is a wishlist

---

## Important Patterns & Conventions

### Context Architecture
All user-specific cloud data is loaded once on auth resolve via contexts:
| Context | Data | Hook |
|---------|------|------|
| `SignupsContext` | User's signups | `useSignups()` |
| `SavedContext` | User's saved event IDs | `useSaved()` |
| `ProfileContext` | Profile + preferences | `useProfileContext()` |

### Auth Loading Guard Pattern
Pages that use both `useAuth()` directly AND a context must guard on both:
```jsx
const { user, loading: authLoading } = useAuth()
const { profile, loading } = useProfileContext()
if (authLoading || loading || !profile) return <p>Loading...</p>
```

### localStorage Keys
| Key | Type | Description |
|-----|------|-------------|
| `volunhub_events` | `Event[]` | Seeded from events.json, never mutated |

### Remaining Spots (always derived, never stored)
```js
const remaining = event.spotsAvailable - getSignupCountForEvent(event.id)
```

### Inline Confirmation Pattern
Used in Signups, Agenda, EventDetail, Profile (Clear My Data):
```jsx
const [confirmingId, setConfirmingId] = useState(null)
// Yes/No buttons toggle confirmingId, action only fires on Yes
```
