import useLocalStorage from '../hooks/useLocalStorage'
import useSaved from '../hooks/useSaved'
import EventCard from '../components/EventCard'
import './Saved.css'

function Saved() {
  const [events] = useLocalStorage('volunhub_events', [])
  const { savedIds } = useSaved()

  const savedEvents = events.filter(e => savedIds.includes(e.id))
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <div>
      <h1 className="page-title">Saved Events</h1>
      <p className="page-subtitle">{savedEvents.length} saved event{savedEvents.length !== 1 ? 's' : ''}</p>
      {savedEvents.length > 0
        ? <div className="events-grid">
            {savedEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        : <div className="empty-state">
            <p>You haven't saved any events yet.</p>
            <p>Browse events and click <strong>♡ Save Event</strong> to add them here.</p>
          </div>
      }
    </div>
  )
}

export default Saved
