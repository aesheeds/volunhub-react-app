# VolunHub — Project Status

## Current State
The app is scaffolded, deployed, and mid-development. MVP features are being built step by step. The app is live on Netlify with continuous deployment from GitHub (main branch).

- **Local dev:** `npm run dev` → `http://localhost:5173`
- **GitHub:** https://github.com/aesheeds/volunhub-react-app
- **Netlify:** Deployed (auto-deploys on every push to main)

---

## Completed

### Infrastructure
- [x] React + Vite project scaffolded
- [x] `react-router-dom` installed and configured
- [x] GitHub repo created and connected to Netlify
- [x] Continuous deployment working (push to main → auto redeploy)

### Data & Storage
- [x] `src/data/events.json` — 20 sample events (Florida locations, varied causes/types/dates)
- [x] `useLocalStorage` hook — generic read/write abstraction for localStorage
- [x] Seed logic in `App.jsx` — seeds `volunhub_events` from `events.json` on first load

### Pages & Components
- [x] `Nav` — navigation bar with links to all 5 pages, active link indicator
- [x] `Browse` page (`/`) — event grid sorted by date, search + multi-select filter bar
- [x] `EventCard` component — shows title, org, cause tag, type tag, location, date, time, spots
- [x] `FilterBar` component — collapsible panel, multi-select pill toggles for cause/location/type, active filter badge, clear all
- [x] `EventDetail` page (`/events/:id`) — full event info, meta grid, working Save + Sign Up buttons. Remaining spots derived live. Back button uses `navigate(-1)`.
- [x] `useSaved` hook — manages `volunhub_saved` string[] in localStorage
- [x] `useSignups` hook — manages `volunhub_signups` array, addSignup, cancelSignup, editNote, isSignedUp, getSignupCountForEvent
- [x] `Saved` page (`/saved`) — shows saved events sorted by date, empty state message
- [x] `EventCard` — remaining spots derived live from signups, shows "Event Full" in red when 0
- [x] Placeholder pages — `Signups`, `Agenda` (render page name only)

---

## In Progress

**Step 8 — Signups Page**
- List view of all signed-up events, cancel + edit note

---

## Remaining MVP Steps

| Step | Feature | Status |
|------|---------|--------|
| 8 | Signups page — list view, cancel, edit note | 🔲 Not started |
| 9 | Agenda page — date-grouped view, cancel | 🔲 Not started |
| 10 | Styling pass — colors, fonts, images, polish | 🔲 Not started |

### Notes on remaining steps
- **Step 7**: Sign up button on EventDetail opens a small inline form (optional note). Spots available will become derived: `event.spotsAvailable - signups.filter(s => s.eventId === id).length`
- **Steps 8 & 9**: Both use the same `useSignups` hook — no duplicated logic. Signups = list view, Agenda = date-grouped view.
- **Step 10**: Styling pass includes adding event images (requires adding an `imageUrl` field to `events.json`), font choices, color refinements, and mobile responsiveness check.

---

## Complete Tier (Later — after MVP is finished)

These features require Supabase and will be planned in detail once MVP is complete.

- [ ] Supabase Auth — user sign up / login / logout
- [ ] Supabase Database — migrate events, signups, and saved data from localStorage to cloud
- [ ] User profiles — personal info, volunteering preferences (causes, locations, types), skills
- [ ] Preferences stored in `volunhub_preferences` localStorage key (already planned in data model as groundwork)
- [ ] Home page for signed-in users — recommended events based on saved preferences

---

## Known Issues / Notes
- LF/CRLF warnings on every git commit — harmless on Windows, no action needed
- `volunhub_events` in localStorage is seeded once on first load. If `events.json` is updated, users need to clear localStorage manually to re-seed (or we add a version/reset mechanism later)
