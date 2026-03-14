# Transcript Highlights

### 1. Deploying Early Instead of Building First (Session 1, early)
Rather than building features in order, I pivoted to deploying the boilerplate app to Netlify first before any real functionality existed. This set up continuous deployment from day one, so every feature after that could be tested on a live URL immediately instead of discovering deployment issues at the end.

### 2. Redesigning Filters from Dropdowns to Pill Toggles (Session 1, midway)
After Claude implemented single-select dropdowns for filtering volunteer events by cause and location, I asked for multi-select so users could pick more than one category at a time. We switched to a pill/tag toggle system where clicking highlights a filter in green — a pattern that ended up being reused throughout the app.

### 3. Keeping Spot Counts Derived, Not Stored (Session 1, midway)
I asked whether spot counts would actually update when someone signed up. Claude explained the choice to compute remaining spots as `spotsAvailable - signupsCount` rather than mutating event data directly. This kept the data model clean and prevented the kind of sync bugs that come from storing the same value in two places.

### 4. Iterating the Edit Note UX into an Inline Form (Session 2, early–midway)
The first version of "Edit Note" opened a separate dialog in the actions column, but I asked to move it inline where the note actually displays, then asked again to move the Save/Cancel buttons directly beneath the textarea instead of off to the side. Each small correction tightened the visual grouping until the form felt natural — and that inline-edit pattern became the standard for the rest of the app.

### 5. Pivoting Agenda from a Duplicate View to a Weekly Calendar (Session 2, midway)
The initial Agenda page just grouped signups by date, which was redundant with the Signups page. Instead of keeping it, we redesigned it into a weekly calendar with Prev/Next/This Week navigation, seven-day rows labeled Mon–Sun, and a "Today" badge. It required custom date math but turned Agenda into the most distinct and polished page in the MVP.
