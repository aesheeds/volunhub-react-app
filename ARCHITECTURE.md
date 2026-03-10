# VolunHub — Architecture Reference

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend framework | React 19 + Vite |
| Routing | react-router-dom v7 |
| Styling | Plain CSS (per-component files) |
| Storage (MVP) | localStorage |
| Storage (Complete Tier) | Supabase Database |
| Auth (Complete Tier) | Supabase Auth |
| Deployment | Netlify (auto-deploy from GitHub main) |

---

## Project Structure

```
src/
├── App.jsx               # Router setup, seed logic
├── App.css               # Global layout styles
├── index.css             # Base reset styles
├── main.jsx              # React entry point
├── data/
│   └── events.json       # 20 static seed events
├── hooks/
│   ├── useLocalStorage.js  # Generic localStorage read/write hook
│   ├── useSaved.js         # (planned) Manages volunhub_saved
│   └── useSignups.js       # (planned) Manages volunhub_signups
├── components/
│   ├── Nav.jsx / Nav.css
│   ├── EventCard.jsx / EventCard.css
│   └── FilterBar.jsx / FilterBar.css
└── pages/
    ├── Browse.jsx / Browse.css
    ├── EventDetail.jsx / EventDetail.css
    ├── Saved.jsx           # (placeholder)
    ├── Signups.jsx         # (placeholder)
    └── Agenda.jsx          # (placeholder)
```

---

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `Browse` | Event grid with search + filter |
| `/events/:id` | `EventDetail` | Full event details, save + sign up actions |
| `/saved` | `Saved` | User's saved/favorited events |
| `/signups` | `Signups` | List view of signed-up events, cancel + edit note |
| `/agenda` | `Agenda` | Signed-up events grouped by date, cancel |

---

## localStorage Data Model

### `volunhub_events` — `Event[]`
Seeded once from `events.json` on first app load. Never mutated after seeding (spots are derived, not decremented).
```json
{
  "id": "evt-001",
  "title": "City Park Cleanup",
  "organization": "GreenCity Initiative",
  "cause": "Environment",
  "location": "Orlando, FL",
  "date": "2026-04-05",
  "time": "9:00 AM",
  "type": "In-Person",
  "description": "...",
  "spotsAvailable": 30
}
```

### `volunhub_saved` — `string[]`
Array of saved event IDs. Empty array by default.
```json
["evt-001", "evt-005"]
```

### `volunhub_signups` — `Signup[]`
Array of signup objects. Empty array by default.
```json
{
  "id": "signup-uuid",
  "eventId": "evt-003",
  "createdAt": "2026-03-10T14:00:00.000Z",
  "note": "Looking forward to this!"
}
```

### `volunhub_preferences` — `Preferences` (groundwork for Complete Tier)
Stores user filter preferences. Empty arrays by default.
```json
{
  "causes": ["Environment", "Animals"],
  "locations": ["Orlando, FL"],
  "types": ["In-Person"]
}
```

---

## Key Design Decisions

### Spots Available (derived, not mutated)
`spotsAvailable` on an event is never decremented. Remaining spots are calculated at render time:
```js
const remaining = event.spotsAvailable - signups.filter(s => s.eventId === event.id).length
```

### Shared Signups Logic
Both `/signups` and `/agenda` read from the same `volunhub_signups` key via a shared `useSignups` hook. No logic is duplicated between the two pages.

### Seed Strategy
On first load, `App.jsx` checks if `volunhub_events` exists in localStorage. If not, it seeds from `events.json`. This means:
- Events data persists across page refreshes
- If `events.json` is updated, users must clear localStorage to re-seed
- A version/reset mechanism can be added later if needed

### Back Navigation
The back button on `EventDetail` currently navigates to `/` (Browse). This should be updated to `navigate(-1)` during the styling pass so it works correctly when navigating from the Saved page.

---

## Custom Hooks

### `useLocalStorage(key, initialValue)`
Generic hook. Works like `useState` but syncs to localStorage.
```js
const [value, setValue] = useLocalStorage('my-key', defaultValue)
// setValue supports function updater pattern:
setValue(prev => [...prev, newItem])
```

### `useSaved()` — planned
Returns: `{ savedIds, isSaved(id), toggleSaved(id) }`
Manages `volunhub_saved` string array.

### `useSignups()` — planned
Returns: `{ signups, isSignedUp(eventId), addSignup(eventId, note), cancelSignup(eventId), editNote(eventId, note) }`
Manages `volunhub_signups` array. Single source of truth for both Signups and Agenda pages.
