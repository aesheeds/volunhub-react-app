import { useNavigate } from 'react-router-dom'
import useSignups from '../hooks/useSignups'
import './EventCard.css'

function EventCard({ event }) {
  const navigate = useNavigate()
  const { getSignupCountForEvent } = useSignups()

  const remainingSpots = event.spotsAvailable - getSignupCountForEvent(event.id)

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
      <p className="event-spots" style={remainingSpots === 0 ? { color: '#c62828' } : {}}>
        {remainingSpots === 0 ? 'Event Full' : `${remainingSpots} spots available`}
      </p>
    </div>
  )
}

export default EventCard
