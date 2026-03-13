# VolunHub — Project Status

## Current State
Phase A (Supabase Auth) is complete. Next up is Phase B (Cloud Database Migration — move signups + saved to Supabase). The app is live on Netlify with continuous deployment from GitHub (main branch).

**⚠️ Remember before final submission:** Re-enable email confirmation in Supabase (Authentication → Providers → Email → "Confirm email"). Currently disabled for dev to avoid rate limits.

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
- [x] `useSaved` hook — manages `volunhub_saved: string[]`
- [x] `useSignups` hook — manages `volunhub_signups: Signup[]`, exposes: `isSignedUp`, `getSignup`, `addSignup`, `cancelSignup`, `editNote`, `getSignupCountForEvent`

### Pages & Components
- [x] `Nav` — auth-aware navbar: Browse always visible; Saved/My Signups/Agenda/Profile only when logged in; Log In button for guests; Log Out button (temporary, moves to Profile in C1); mobile hamburger menu (simple, to be polished in D4)
- [x] `Browse` (`/`) — event grid sorted by date, collapsible FilterBar with multi-select pill toggles
- [x] `FilterBar` — search input + cause/location/type pill groups, active filter badge, "Clear all filters"
- [x] `EventCard` — cause/type tags, title, org, location, date, time, remaining spots (derived live), "Event Full" in red
- [x] `EventDetail` (`/events/:id`) — full info, Save + Sign Up buttons (redirect to /login if guest), inline note form, remaining spots derived, back uses `navigate(-1)`
- [x] `useSaved` + Save button — toggles ♡/♥, persists across navigation
- [x] `useSignups` + Sign Up flow — inline note form, confirm button, cancels from detail page, spots update everywhere
- [x] `Saved` (`/saved`) — saved events sorted by date, empty state message
- [x] `Signups` (`/signups`) — list view sorted by date, cancel with inline confirm (Yes/No), shows note if present, Edit Note with inline textarea (opens in place of note, Save/Cancel below textarea, state conflicts guarded)
- [x] `Agenda` (`/agenda`) — weekly view with Prev/Next/This Week navigation, 7 day rows (Mon–Sun), Today badge, "X events this week" subtitle, Cancel Signup with inline confirm, timezone-safe date keys, confirm resets on week navigation

---

### Auth (Phase A — Complete)
- [x] `src/lib/supabase.js` — Supabase client, reads from `.env` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- [x] `useAuth` hook — `user`, `loading`, `signIn`, `signUp`, `signOut`, `resendConfirmation`
- [x] `Login` page (`/login`) — email/password form, error display, loading state
- [x] `SignUp` page (`/signup`) — email/password/confirm form, regex validation (number + special char), "Check your email" screen with resend button
- [x] `ProtectedRoute` — redirects guests to `/login`, loading guard prevents flash
- [x] Protected routes: `/saved`, `/signups`, `/agenda` (profile to be added in C1)
- [x] Session persistence — handled automatically by Supabase localStorage
- [x] Seed fix — moved to module level so Browse loads events on first visit without refresh

## In Progress

**Next up: Phase B — Cloud Database Migration**

---

## Step Tracker

| Step | Feature | Status |
|------|---------|--------|
| 9 | Agenda page — weekly view with navigation, cancel | ✅ Done |
| 10 | Styling pass — polish, fonts, images, mobile check | 🔲 Deferred until after auth |
| A1 | Supabase project setup + SDK install | ✅ Done |
| A2 | Login + Sign Up pages | ✅ Done |
| A3 | `useAuth` hook | ✅ Done |
| A4 | Session persistence in `App.jsx` | ✅ Done (automatic) |
| A5 | `ProtectedRoute` component | ✅ Done |
| A6 | Apply protected routes | ✅ Done |
| A7 | Update Nav for auth state | ✅ Done |
| B1 | Create Supabase tables + schema | 🔲 Not started |
| B2 | Row Level Security (RLS) policies | 🔲 Not started |
| B3 | Migrate `useSignups` → Supabase | 🔲 Not started |
| B4 | Migrate `useSaved` → Supabase | 🔲 Not started |
| B5 | Test data isolation between users | 🔲 Not started |
| C1 | Profile page — display + edit preferences | 🔲 Not started |
| C2 | Save preferences to `profiles` table | 🔲 Not started |
| C3 | Home page — recommended events by preference | 🔲 Not started |
| C4 | Routing — Browse for guests, Home for logged-in | 🔲 Not started |
| D1 | Style auth pages to match VolunHub design | 🔲 Not started |
| D2 | Loading states for async Supabase calls | 🔲 Not started |
| D3 | Error handling — wrong password, email taken, etc. | 🔲 Not started |
| D4 | Step 10 styling pass (fonts, images, mobile) | 🔲 Not started |

---

## Full Plan: Auth + Cloud DB + Profile

### Technology Choice: Supabase
- **Why Supabase:** Gives both Auth AND a Postgres database in one place. Row Level Security (RLS) handles per-user data isolation cleanly. Free tier is generous. Already planned in original architecture.
- **Install:** `npm install @supabase/supabase-js`
- **Client file:** `src/lib/supabase.js` — create the Supabase client, export it, import everywhere needed

### Access Rules
- **Public (no login needed):** Browse (`/`), EventDetail (`/events/:id`)
- **Protected (login required):** Saved (`/saved`), Signups (`/signups`), Agenda (`/agenda`), Profile (`/profile`), Home (`/home`)
- Users without an account can browse and view events but cannot save or sign up

---

### Phase A — Supabase Auth

**A1 — Supabase Setup**
- Create project at supabase.com
- Copy `SUPABASE_URL` and `SUPABASE_ANON_KEY` into `.env` as `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Add `.env` to `.gitignore` (critical — never commit keys)
- Create `src/lib/supabase.js`:
```js
import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```
- Set env vars in Netlify dashboard too (Settings → Environment Variables)

**A2 — Login + Sign Up Pages**
- `src/pages/Login.jsx` + `Login.css` — email/password form, link to sign up
- `src/pages/SignUp.jsx` + `SignUp.css` — email/password form, link to login
- Both use `supabase.auth.signInWithPassword()` and `supabase.auth.signUp()`
- On success: `navigate('/')` (or `/home` once that exists)
- Style to match VolunHub design (green primary button, `#f4f6f9` background)

**A3 — `useAuth` Hook**
- `src/hooks/useAuth.js`
- Returns: `{ user, loading, signIn(email, pw), signUp(email, pw), signOut() }`
- Uses `supabase.auth.getSession()` on mount + `supabase.auth.onAuthStateChange()` listener

**A4 — Session Persistence in `App.jsx`**
- Supabase stores the session in localStorage automatically
- `onAuthStateChange` in `useAuth` keeps `user` state in sync on refresh
- No extra work needed beyond wiring up the hook

**A5 — `ProtectedRoute` Component**
- `src/components/ProtectedRoute.jsx`
- If `loading`: show spinner/null
- If no `user`: `<Navigate to="/login" />`
- Otherwise: render `children`
```jsx
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  return children
}
```

**A6 — Apply Protected Routes**
- Wrap `/saved`, `/signups`, `/agenda`, `/profile` in `<ProtectedRoute>` in `App.jsx`
- Add `/login` and `/signup` routes

**A7 — Update Nav**
- If logged out: show "Login" button (navigates to `/login`)
- If logged in: show user's email (or display name) + "Logout" button
- Logout calls `supabase.auth.signOut()` then `navigate('/')`

---

### Phase B — Cloud Database Migration

**B1 — Supabase Tables**

`profiles` table:
```sql
id uuid references auth.users primary key,
email text,
display_name text,
preferred_causes text[],
preferred_locations text[],
preferred_types text[],
created_at timestamptz default now()
```

`signups` table:
```sql
id uuid primary key default gen_random_uuid(),
user_id uuid references auth.users not null,
event_id text not null,
note text,
created_at timestamptz default now()
```

`saved_events` table:
```sql
id uuid primary key default gen_random_uuid(),
user_id uuid references auth.users not null,
event_id text not null,
created_at timestamptz default now()
```

**B2 — Row Level Security (RLS)**
- Enable RLS on all three tables
- Policy for each: `user_id = auth.uid()` for SELECT, INSERT, UPDATE, DELETE
- This means users can only ever see and modify their own rows

**B3 — Rewrite `useSignups`**
- All functions become async (use `await supabase.from('signups')...`)
- Add `loading` state
- `addSignup(eventId, note)` → insert row with `user_id: user.id`
- `cancelSignup(eventId)` → delete where `event_id = eventId AND user_id = user.id`
- `editNote(eventId, note)` → update where `event_id = eventId AND user_id = user.id`
- `isSignedUp(eventId)` → check local state (loaded once on mount)
- `getSignupCountForEvent(eventId)` → still derived from local state (all signups loaded on mount)
  - **Note:** This means signup counts are global — all users' signups count toward spots. This is correct behavior.

**B4 — Rewrite `useSaved`**
- Same pattern as useSignups
- `toggleSaved(eventId)` → insert or delete row
- `isSaved(eventId)` → check local state

**B5 — Test Data Isolation**
- Create two test accounts
- Sign up for events with each
- Confirm `/signups` and `/saved` only show that user's data

---

### Phase C — Profile & Home Page

**C1–C2 — Profile Page**
- `src/pages/Profile.jsx` + `Profile.css`
- On load: fetch from `profiles` table where `id = user.id`
- If no profile row yet (new user): create one on first save (upsert)
- Shows: email (read-only), display name (editable), preference pills (causes, locations, types — same pill UI as FilterBar)
- Save button: `supabase.from('profiles').upsert(...)`

**C3–C4 — Home Page**
- `src/pages/Home.jsx` + `Home.css`
- Load user's profile preferences
- Filter `events.json` by matching causes/locations/types
- If no preferences set: show "Update your profile to get recommendations" + link to `/profile`
- If preferences set: show matching events in same EventCard grid as Browse
- Routing: guests hit `/` (Browse), logged-in users are redirected to `/home`
  - Or: keep `/` as Browse for everyone and add `/home` as an extra page in Nav for logged-in users (simpler, less disruptive)

---

### Phase D — Polish

**D1 — Style auth pages** to match existing design (green buttons, same font/background)

**D2 — Loading states** — while Supabase fetches data, show a spinner or skeleton. All pages that use `useSignups` or `useSaved` will need a `loading` check.

**D3 — Error handling** — display user-friendly messages for:
- Wrong password / email not found
- Email already registered
- Network errors on save/signup

**D4 — Original styling pass** (Step 10):
- Add `imageUrl` to `events.json`, display on EventDetail
- Font refinement, mobile responsiveness check

---

### Key Things to Know

1. **`.env` file** — never commit it. Add to `.gitignore` before creating it. Set the same vars in Netlify dashboard.
2. **Async hooks** — the biggest change. `useSignups` and `useSaved` will return `loading: true` initially. Every page using them needs a loading guard before rendering.
3. **`getSignupCountForEvent` still works** — because we load ALL signups on mount (not just the current user's), the remaining spots count stays global and correct.
4. **Events stay in `events.json`** — no need to move events to Supabase. They're static seed data. Only user-specific data (signups, saved, profiles) moves to the cloud.
5. **Supabase profile row** — created on first profile save, not on sign-up. Use `upsert` so it works for both create and update.
6. **`useLocalStorage` hook** — still used for `volunhub_events` seeding. Can be kept as-is.

---

## Important Patterns & Conventions

### localStorage Keys
| Key | Type | Description |
|-----|------|-------------|
| `volunhub_events` | `Event[]` | Seeded from events.json, never mutated after seed |
| `volunhub_saved` | `string[]` | Array of saved event IDs |
| `volunhub_signups` | `Signup[]` | `{ id, eventId, createdAt, note }` |
| `volunhub_preferences` | `object` | `{ causes: [], locations: [], types: [] }` (groundwork for Complete Tier) |

### Remaining Spots (always derived, never stored)
```js
const remaining = event.spotsAvailable - getSignupCountForEvent(event.id)
```

### Inline Confirmation Pattern (used in Signups, reuse in Agenda)
```jsx
const [confirmingId, setConfirmingId] = useState(null)

// In JSX:
{confirmingId === signup.id ? (
  <div className="cancel-confirm">
    <p className="cancel-confirm-text">Cancel signup?</p>
    <div className="cancel-confirm-btns">
      <button className="btn-confirm-yes" onClick={() => { cancelSignup(event.id); setConfirmingId(null) }}>Yes</button>
      <button className="btn-confirm-no" onClick={() => setConfirmingId(null)}>No</button>
    </div>
  </div>
) : (
  <button className="btn-cancel-signup" onClick={() => setConfirmingId(signup.id)}>Cancel Signup</button>
)}
```

### Shared CSS Classes (defined in multiple files — be aware of duplication)
- `.cause-tag`, `.type-tag` — defined in `EventCard.css`, `EventDetail.css`, `Signups.css`
- `.page-title`, `.page-subtitle` — defined in `Browse.css`, reused via same class name in `Saved.css`, `Signups.css`
- `.empty-state` — defined in `Saved.css` and `Signups.css`
- These could be consolidated into a global stylesheet during the Step 10 styling pass

---

## Known Issues / Notes
- LF/CRLF warnings on every git commit — harmless on Windows, no action needed
- `volunhub_events` seeded once on first load. If `events.json` is updated, clear localStorage manually to re-seed
- Shared CSS classes are duplicated across component/page CSS files — consolidate during styling pass
