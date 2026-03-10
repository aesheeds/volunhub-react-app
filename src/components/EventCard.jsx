import { useNavigate } from 'react-router-dom'
import './EventCard.css'

function EventCard({ event }) {
  const navigate = useNavigate()

  return (
    <div className="event-card" onClick={() => navigate(`/events/${event.id}`)}>
      <div className="event-card-header">
        <span className="cause-tag">{event.cause}</span>
        <span className="type-tag">{event.type}</span>
      </div>
      <h3 className="event-title">{event.title}</h3>
      <p className="event-org">{event.organization}</p>
      <div className="event-meta">
        <span>📍 {event.location}</span>
        <span>📅 {new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        <span>🕐 {event.time}</span>
      </div>
      <p className="event-spots">{event.spotsAvailable} spots available</p>
    </div>
  )
}

export default EventCard
