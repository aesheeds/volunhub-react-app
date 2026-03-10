import useLocalStorage from '../hooks/useLocalStorage'
import EventCard from '../components/EventCard'
import './Browse.css'

function Browse() {
  const [events] = useLocalStorage('volunhub_events', [])

  const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <div>
      <h1 className="page-title">Browse Events</h1>
      <p className="page-subtitle">{events.length} events available</p>
      <div className="events-grid">
        {sortedEvents.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}

export default Browse
