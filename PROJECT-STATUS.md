# VolunHub — Project Status

## Current State
The app is mid-development. Most MVP features are complete. Currently finishing Step 8 (Signups page). The app is live on Netlify with continuous deployment from GitHub (main branch).

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
- [x] `Nav` — green navbar, NavLink active indicator, links to all 5 pages
- [x] `Browse` (`/`) — event grid sorted by date, collapsible FilterBar with multi-select pill toggles
- [x] `FilterBar` — search input + cause/location/type pill groups, active filter badge, "Clear all filters"
- [x] `EventCard` — cause/type tags, title, org, location, date, time, remaining spots (derived live), "Event Full" in red
- [x] `EventDetail` (`/events/:id`) — full info, working Save + Sign Up buttons, inline note form, remaining spots derived, back uses `navigate(-1)`
- [x] `useSaved` + Save button — toggles ♡/♥, persists across navigation
- [x] `useSignups` + Sign Up flow — inline note form, confirm button, cancels from detail page, spots update everywhere
- [x] `Saved` (`/saved`) — saved events sorted by date, empty state message
- [x] `Signups` (`/signups`) — list view sorted by date, cancel with inline confirm (Yes/No), shows note if present, Edit Note with inline textarea (opens in place of note, Save/Cancel below textarea, state conflicts guarded)
- [x] `Agenda` (`/agenda`) — date-grouped view of signups, date headers in green, click-to-navigate, note display. Cancel not yet added (9.2).

---

## In Progress

**Step 9 — Agenda page**
- 9.1 ✅ Scaffold + grouped data display (date headers, event cards, click-to-navigate, note display)
- 9.2 🔲 Cancel Signup with inline confirm

---

## Remaining MVP Steps

| Step | Feature | Status |
|------|---------|--------|
| 8.2 | Edit Note on Signups page | ✅ Done |
| 9.1 | Agenda — scaffold + grouped data display | ✅ Done |
| 9.2 | Agenda — Cancel Signup with inline confirm | 🔲 Not started |
| 10 | Styling pass — polish, fonts, images, mobile check | 🔲 Not started |

### Step 9 — Agenda Page Notes
- Path: `/agenda`
- Uses same `useSignups` hook (no new hook needed)
- Groups signed-up events by date (e.g. "April 5, 2026" → list of events that day)
- Each event shows same info as Signups page
- Cancel with inline confirm (same pattern as Signups page — reuse `confirmingId` state pattern)
- Shared helper for grouping by date:
  ```js
  // Group signedUpEvents by event.date
  const grouped = signedUpEvents.reduce((acc, item) => {
    const key = item.event.date
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})
  const sortedDates = Object.keys(grouped).sort()
  ```

### Step 10 — Styling Pass Notes
- Add `imageUrl` field to each event in `events.json` (use placeholder image URLs or a consistent source)
- Display image at top of `EventDetail` card
- Font refinement (currently uses system-ui)
- Color palette is already established: green `#2e7d32`, purple `#5e35b1`, red `#c62828`, bg `#f4f6f9`
- Mobile responsiveness check (Nav, FilterBar pills, EventCard grid, EventDetail meta grid)
- Update back button label dynamically (currently says "← Back" — acceptable for now)

---

## Complete Tier (Later — after MVP is finished)

These features require Supabase and will be planned in detail once MVP is complete.

- [ ] Supabase Auth — user sign up / login / logout
- [ ] Supabase Database — migrate events, signups, and saved data from localStorage to cloud
- [ ] User profiles — personal info, volunteering preferences (causes, locations, types), skills
- [ ] Preferences stored in `volunhub_preferences` localStorage key (already planned in data model as groundwork)
- [ ] Home page for signed-in users — recommended events based on saved preferences

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
