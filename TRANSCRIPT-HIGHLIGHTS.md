### Changing the Agenda View to make it distinct (Session 2, midway)
The initial Agenda page just grouped signups by date, which didn't make sense with the Signups page. It looked exasctly the same. We redesigned it into a weekly calendar view, which was my idea from the start. We used Prev/Next/This Week navigation, seven-day rows labeled Mon–Sun, and a "Today" badge. 

### Fixing 15 second load times (Session 4, midway)
After migrating `useSignups` to fetch from Supabase, pages took 15 seconds to load. I asked Claude why this was happening and it said that the `user` object was changing reference on every token refresh, triggering infinite re-fetches. We figured that by changing the `useEffect` dependency from `[user]` to `[user?.id]` it would help with loading times. It ended up fixing instantly!!

### Pushing back on styling choices(Session 8, midway)
After Claude swapped all buttons to match the purple color I wanted to use, I had wanted the buttons for the signup and save to be green instead. Green felt right, there was already too much purple, and color green felt like it fit better with the buttons purpose. I had Claude change the color to a more darker green (#4a6b1e, #3a5518) that kept the color meaning while staying on-brand!
