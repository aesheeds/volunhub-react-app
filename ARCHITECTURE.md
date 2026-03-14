# VolunHub — Architecture Reference

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend framework | React 19 + Vite |
| Routing | react-router-dom v7 |
| Styling | Plain CSS (per-component files) |
| Auth | Supabase Auth |
| Database | Supabase (Postgres) |
| Static data | localStorage (events only) |
| Deployment | Netlify (auto-deploy from GitHub main) |

---

## Project Structure

```
src/
├── App.jsx               # Router setup, seed logic, context providers
├── App.css               # Global layout styles
├── index.css             # Base reset styles
├── main.jsx              # React entry point
├── data/
│   └── events.json       # 20 static seed events
├── lib/
│   └── supabase.js       # Supabase client (reads from .env)
├── hooks/
│   ├── useLocalStorage.js  # Generic localStorage read/write hook
│   ├── useAuth.js          # Supabase auth: user, loading, signIn, signUp, signOut
│   ├── useSaved.js         # Thin wrapper → SavedContext
│   └── useSignups.js       # Thin wrapper → SignupsContext
├── context/
│   ├── SignupsContext.jsx  # Fetches + caches signups on auth resolve
│   ├── SavedContext.jsx    # Fetches + caches saved event IDs on auth resolve
│   └── ProfileContext.jsx  # Fetches + caches profile + preferences on auth resolve
├── components/
│   ├── Nav.jsx / Nav.css
│   ├── EventCard.jsx / EventCard.css
│   ├── FilterBar.jsx / FilterBar.css
│   └── ProtectedRoute.jsx
└── pages/
    ├── Browse.jsx / Browse.css
    ├── Home.jsx / Home.css
    ├── EventDetail.jsx / EventDetail.css
    ├── Saved.jsx / Saved.css
    ├── Signups.jsx / Signups.css
    ├── Agenda.jsx / Agenda.css
    ├── Profile.jsx / Profile.css
    ├── Login.jsx / Login.css
    └── SignUp.jsx (uses Login.css)
```

---

## Routes

| Path | Component | Auth | Description |
|------|-----------|------|-------------|
| `/` | `Browse` | Public | Event grid with search + filter |
| `/events/:id` | `EventDetail` | Public | Full event details, save + sign up |
| `/home` | `Home` | Protected | Personalized recommendations by preference |
| `/saved` | `Saved` | Protected | User's saved/favorited events |
| `/signups` | `Signups` | Protected | List of signed-up events, cancel + edit note |
| `/agenda` | `Agenda` | Protected | Weekly view of signed-up events |
| `/profile` | `Profile` | Protected | Edit name, preferences, log out, clear data |
| `/login` | `Login` | Public | Email/password login |
| `/signup` | `SignUp` | Public | Account creation → redirects to /profile?welcome=true |

---

## Supabase Schema

### `profiles`
```sql
id uuid references auth.users primary key,
email text,
first_name text,
last_name text,
preferred_causes text[],
preferred_locations text[],
preferred_types text[],
created_at timestamptz default now()
```

### `signups`
```sql
id uuid primary key default gen_random_uuid(),
user_id uuid references auth.users not null,
event_id text not null,
note text,
created_at timestamptz default now()
```

### `saved_events`
```sql
id uuid primary key default gen_random_uuid(),
user_id uuid references auth.users not null,
event_id text not null,
created_at timestamptz default now()
```

RLS enabled on all three tables. Policy: `user_id = auth.uid()` for all operations.

---

## Context Architecture

All user cloud data is fetched **once on auth resolve** and cached in context. Pages read from context — no per-page fetches.

```
App
├── SignupsProvider   → useSignups() / useSignupsContext()
├── SavedProvider     → useSaved() / useSavedContext()
└── ProfileProvider   → useProfileContext()
```

### Auth Loading Guard Pattern
Pages using both `useAuth()` directly and a context need to guard on both loading states:
```jsx
const { user, loading: authLoading } = useAuth()
const { profile, loading } = useProfileContext()
if (authLoading || loading || !profile) return <p>Loading...</p>
```
This prevents crashes when the page's own `useAuth()` instance (starts with `user=null`) hasn't resolved yet, even if the context already has data.

---

## Key Design Decisions

### Spots Available (derived, not mutated)
`spotsAvailable` on an event is never decremented. Remaining spots are calculated at render time:
```js
const remaining = event.spotsAvailable - getSignupCountForEvent(event.id)
```

### Email Confirmation Disabled
Supabase free tier allows only 2 confirmation emails/hour — incompatible with demo/grading scenarios. Email confirmation is permanently disabled for this project. Auth accounts are not deleted (requires service_role key); "Clear My Data" deletes all user data rows and resets the profile flow.

### Events Stay in `events.json`
Events are static seed data — only user-specific data (signups, saved, profiles) lives in Supabase.

### Back Navigation
`EventDetail` uses `navigate(-1)` so back works correctly from Browse, Home, Saved, etc.

### Inline Confirmation Pattern
Destructive actions (cancel signup, clear data) use an inline Yes/No confirm rather than browser `confirm()`. Consistent across Signups, Agenda, EventDetail, and Profile pages.

---

## Custom Hooks

### `useAuth()`
Returns: `{ user, loading, signIn, signUp, signOut }`
Each call creates its own state instance. Use `loading` guard before accessing `user`.

### `useSaved()`
Returns: `{ savedIds, loading, isSaved(id), toggleSaved(id) }`
Thin wrapper over `SavedContext`.

### `useSignups()`
Returns: `{ signups, loading, isSignedUp(eventId), getSignup(eventId), addSignup(eventId, note), cancelSignup(eventId), editNote(eventId, note), getSignupCountForEvent(eventId) }`
Thin wrapper over `SignupsContext`.

### `useProfileContext()`
Returns: `{ profile, loading, updateProfile(updates), resetProfile() }`
`profile` shape: `{ firstName, lastName, causes, locations, types }`
