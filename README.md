# VolunHub

A volunteering event finder and tracker built with React. Browse local volunteer opportunities, save favorites, sign up, and track your schedule in a weekly agenda view — all backed by Supabase for auth and cloud data storage.

**Live app:** [volunhub on Netlify](https://github.com/aesheeds/volunhub-react-app) | **Repo:** https://github.com/aesheeds/volunhub-react-app

---

## Features

- **Browse & filter events** — Search by keyword; filter by cause, location, and type using pill toggles
- **Event detail** — Full event info, remaining spots (derived live from signups), save and sign up actions
- **Save events** — Bookmark events to a personal favorites list; persisted to Supabase
- **Sign up & manage** — Register for events with an optional note; edit or cancel from the Signups page
- **Weekly agenda** — See signed-up events in a Mon–Sun calendar view with Prev/Next/This Week navigation
- **Authentication** — Sign up and log in via Supabase Auth; protected routes redirect guests to login
- **Per-user data isolation** — Saved events and signups are stored in Supabase with Row Level Security; each user only sees their own data

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

### 3. Supabase database schema

Run the following SQL in your Supabase SQL editor:

```sql
-- Profiles
create table profiles (
  id uuid references auth.users primary key,
  email text,
  display_name text,
  preferred_causes text[],
  preferred_locations text[],
  preferred_types text[],
  created_at timestamptz default now()
);

-- Signups
create table signups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  event_id text not null,
  note text,
  created_at timestamptz default now()
);

-- Saved events
create table saved_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  event_id text not null,
  created_at timestamptz default now()
);

-- Enable Row Level Security on all tables
alter table profiles enable row level security;
alter table signups enable row level security;
alter table saved_events enable row level security;

-- RLS policies (users can only access their own rows)
create policy "Own profile" on profiles for all using (id = auth.uid());
create policy "Own signups" on signups for all using (user_id = auth.uid());
create policy "Own saved" on saved_events for all using (user_id = auth.uid());
```

### 4. Run locally

```bash
npm run dev
```

App runs at `http://localhost:5173`.

### 5. Deploy to Netlify

Connect your GitHub repo to Netlify. Add the same environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) in Netlify → Settings → Environment Variables. Every push to `main` triggers a new deploy automatically.

> **Before final submission:** Re-enable email confirmation in Supabase → Authentication → Providers → Email → "Confirm email". It is currently disabled for development to avoid rate limits.

---

## Project Structure

```
src/
├── App.jsx               # Router setup, localStorage seed logic
├── data/
│   └── events.json       # 20 static sample events (Florida, Apr–May 2026)
├── hooks/
│   ├── useAuth.js        # Supabase auth state (user, signIn, signUp, signOut)
│   ├── useLocalStorage.js
│   ├── useSaved.js       # Manages saved_events table
│   └── useSignups.js     # Manages signups table
├── components/
│   ├── Nav.jsx           # Auth-aware navbar with mobile hamburger
│   ├── EventCard.jsx     # Card with tags, date, spots remaining
│   ├── FilterBar.jsx     # Search + pill filter toggles
│   └── ProtectedRoute.jsx
└── pages/
    ├── Browse.jsx        # Event grid (public)
    ├── EventDetail.jsx   # Full event + save/signup actions
    ├── Saved.jsx         # Saved events list (protected)
    ├── Signups.jsx       # Signup management (protected)
    ├── Agenda.jsx        # Weekly calendar view (protected)
    ├── Login.jsx
    └── SignUp.jsx
```

---

## Known Bugs & Limitations

- **Signup counts are global** — remaining spots are calculated from all users' signups loaded at mount. If another user signs up in a different browser tab, counts won't update until the page is refreshed.
- **Event data requires manual re-seed** — if `events.json` is updated, users need to clear localStorage (`volunhub_events`) to see new events. No auto-versioning mechanism exists yet.
- **CSS duplication** — shared classes like `.cause-tag`, `.page-title`, and `.empty-state` are defined in multiple component CSS files. Planned for consolidation in a future styling pass.
- **Mobile nav is basic** — the hamburger menu works but has not received a full polish pass. Styling improvements are planned (Phase D).
- **No loading states yet** — Supabase async calls don't show spinners during fetch. Pages may flash empty before data loads (Phase D).
- **Profile page not yet built** — Phase C (Profile + Home with recommendations) is the next planned phase.
- **LF/CRLF warnings** — appear on every git commit on Windows. Harmless; no action needed.

---

## What I Learned

Building VolunHub with AI assistance fundamentally changed how I think about the development process. Rather than getting stuck on syntax or setup details, I could focus on what the app should *do* — describing features in plain language and iterating quickly on the result. I learned that AI tools are most effective when you treat them as a collaborative partner: they handle the "how" efficiently, but you still need to drive the "what" and "why" with clear intent and careful review of every output. I was surprised how much I still needed to understand about the underlying technologies — concepts like Row Level Security, async hooks, and localStorage seeding became much clearer once I saw them applied in context and had to debug issues myself. The experience also taught me the importance of structured planning documents like PROJECT-STATUS.md and ARCHITECTURE.md; keeping these updated made it easy to resume work across multiple sessions without losing context. Overall, AI-assisted development accelerated my learning curve significantly while reinforcing that human judgment, design thinking, and understanding of fundamentals remain essential throughout.
