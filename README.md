# VolunHub

A volunteering event finder and tracker built with React. Browse local volunteer opportunities, save favorites, sign up, and track your schedule in a weekly agenda view — all backed by Supabase for auth and cloud data storage.

**Live app:** [volunhub on Netlify](https://volunhub.netlify.app/) | **Repo:** https://github.com/aesheeds/volunhub-react-app

---

## Features

- **Browse & filter events** — Search by keyword; filter by cause, location, and type using pill toggles; sort by date, spots remaining, or A–Z
- **Event detail** — Full event info, remaining spots (derived live from signups), save and sign up actions
- **Save events** — Bookmark events to a personal favorites list; persisted to Supabase
- **Sign up & manage** — Register for events with an optional note; edit or cancel from the Signups page
- **Weekly agenda** — See signed-up events in a Mon–Sun calendar view with Prev/Next/This Week navigation
- **Personalized home** — Recommendations filtered by your saved cause, location, and type preferences
- **Profile** — Set your name and preferences; data saved to Supabase; clear all data option
- **Post events** — Create, edit, and delete your own volunteer events (sample feature, localStorage-based)
- **Authentication** — Sign up and log in via Supabase Auth; protected routes redirect guests to login
- **Per-user data isolation** — Saved events and signups are stored in Supabase with Row Level Security; each user only sees their own data
- **Welcome modal** — First-time visitors see a one-time intro modal on first app open

---

## Technologies Used

| Layer | Technology |
|-------|-----------|
| Frontend framework | React 19 + Vite |
| Routing | react-router-dom v7 |
| Styling | Plain CSS (per-component files) |
| Auth | Supabase Auth |
| Database | Supabase (PostgreSQL) with Row Level Security |
| Event data | Static JSON (`events.json`), seeded to localStorage on first load |
| Deployment | Netlify (auto-deploy from GitHub `main`) |

---

## Architecture Overview

### Frontend
VolunHub is a single-page React application built with Vite. Routing is handled by react-router-dom v7 with protected routes that redirect unauthenticated users to `/login`. All styling is plain CSS — one file per component, with shared utility classes (tags, buttons, confirm patterns) defined globally in `App.css`.

User-specific cloud data (signups, saved events, profile) is fetched once on auth resolve and cached in React Context providers (`SignupsContext`, `SavedContext`, `ProfileContext`). Pages read from context — no per-page fetches — keeping the UI fast and consistent.

Static event data lives in `events.json` and is seeded into `localStorage` on first load. User-created events are appended to the same `localStorage` key at runtime.

### Backend
Authentication and data storage are handled entirely by [Supabase](https://supabase.com):

- **Auth** — email/password via Supabase Auth. Email confirmation is disabled (see note in Setup).
- **Database** — PostgreSQL with three tables: `profiles`, `signups`, `saved_events`. Row Level Security (RLS) ensures each user can only read and write their own rows.
- **No custom server** — the frontend communicates directly with Supabase via the JS client library.

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project with the following tables created (see schema below)

### 1. Clone and install

```bash
git clone https://github.com/aesheeds/volunhub-react-app.git
cd volunhub-react-app
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root (never commit this file):

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Create Supabase tables

Run the SQL from the [Database Schema](#database-schema) section below in your Supabase SQL editor.

### 4. Run locally

```bash
npm run dev
```

App runs at `http://localhost:5173`.

### 5. Deploy to Netlify

Connect your GitHub repo to Netlify. Add the same environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) in Netlify → Settings → Environment Variables. Every push to `main` triggers a new deploy automatically.

> **Note:** Email confirmation is intentionally disabled. Supabase free tier allows only 2 confirmation emails/hour — incompatible with demo and grading scenarios.

---

## Project Structure

```
src/
├── App.jsx               # Router setup, context providers, localStorage seed logic
├── data/
│   └── events.json       # 20 static sample events (Florida, Apr–May 2026)
├── hooks/
│   ├── useAuth.js        # Supabase auth state (user, signIn, signUp, signOut)
│   ├── useLocalStorage.js
│   ├── useSaved.js       # Thin wrapper over SavedContext
│   └── useSignups.js     # Thin wrapper over SignupsContext
├── context/
│   ├── SignupsContext.jsx # Fetches + caches signups on auth resolve
│   ├── SavedContext.jsx   # Fetches + caches saved event IDs on auth resolve
│   └── ProfileContext.jsx # Fetches + caches profile + preferences on auth resolve
├── utils/
│   └── causeImages.js    # Cause → fallback image URL mapping
├── components/
│   ├── Nav.jsx           # Auth-aware navbar with mobile hamburger + scroll-aware hide/show
│   ├── EventCard.jsx     # Card with tags, date, spots remaining
│   ├── FilterBar.jsx     # Search + pill filter toggles
│   ├── WelcomeModal.jsx  # First-visit onboarding modal
│   ├── Spinner.jsx
│   └── ProtectedRoute.jsx
└── pages/
    ├── Browse.jsx        # Event grid (public)
    ├── EventDetail.jsx   # Full event + save/signup actions
    ├── Home.jsx          # Personalized recommendations (protected)
    ├── Saved.jsx         # Saved events list (protected)
    ├── Signups.jsx       # Signup management (protected)
    ├── Agenda.jsx        # Weekly calendar view (protected)
    ├── MyEvents.jsx      # Post/edit/delete user-created events (protected)
    ├── Profile.jsx       # Name + preferences + clear data (protected)
    ├── Login.jsx
    └── SignUp.jsx
```

---

## Database Schema

Three tables in Supabase PostgreSQL. RLS is enabled on all — each user can only access their own rows.

### `profiles`
```sql
create table profiles (
  id uuid references auth.users primary key,
  email text,
  first_name text,
  last_name text,
  preferred_causes text[],
  preferred_locations text[],
  preferred_types text[],
  created_at timestamptz default now()
);
```

### `signups`
```sql
create table signups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  event_id text not null,
  note text,
  created_at timestamptz default now()
);
```

### `saved_events`
```sql
create table saved_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  event_id text not null,
  created_at timestamptz default now()
);
```

### RLS policies
```sql
alter table profiles enable row level security;
alter table signups enable row level security;
alter table saved_events enable row level security;

create policy "Own profile" on profiles for all using (id = auth.uid());
create policy "Own signups" on signups for all using (user_id = auth.uid());
create policy "Own saved" on saved_events for all using (user_id = auth.uid());
```

---

## Known Bugs & Limitations

- **Post Events is a sample feature** — user-created events are stored in `localStorage` only. They are not saved to the cloud or `events.json`, so they do not transfer across devices or persist after clearing browser storage. A full implementation would store events in Supabase and make them visible to all users. This is a planned future improvement.
- **Orphaned signups from user-created events** — if a user creates an event on one device, signs up for it, then logs in on a different device, the signup will appear as "Event only available on the device where it was created" since localStorage does not sync across devices. The user can remove it from the Signups page.
- **Signup counts are global** — remaining spots are calculated from all signups loaded at mount. If another user signs up in a different tab, counts won't update until the page is refreshed.
- **Event data requires manual re-seed** — if `events.json` is updated, users need to clear `localStorage` (`volunhub_events`) to see new events.
- **LF/CRLF warnings** — appear on every git commit on Windows. Harmless; no action needed.

---

## What I Learned
Building VolunHub with Claude has changed the way I think about the development process as a whole. Rather than getting stuck with setup details or syntax, I could focus on what the app should do. I feel like this has expanded my creativity, opening myself up to many opportunities in this projects. It's best to use an AI tool as a collaborative partner, they handle on how to make the app, whule I drive that "what and "why" of the project. I still needed to understand what was happening, as that is how I could make sure mistakes weren't being made, but this has made making a full stack projects faster and easier! 