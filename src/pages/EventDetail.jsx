import { useParams, useNavigate } from 'react-router-dom'
import useLocalStorage from '../hooks/useLocalStorage'
import './EventDetail.css'

function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [events] = useLocalStorage('volunhub_events', [])

  const event = events.find(e => e.id === id)

  if (!event) {
    return (
      <div className="not-found">
        <h2>Event not found.</h2>
        <button onClick={() => navigate('/')}>Back to Browse</button>
      </div>
    )
  }

  const formattedDate = new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  })

  return (
    <div className="event-detail">
      <button className="back-btn" onClick={() => navigate('/')}>← Back to Browse</button>

      <div className="detail-card">
        <div className="detail-tags">
          <span className="cause-tag">{event.cause}</span>
          <span className="type-tag">{event.type}</span>
        </div>

        <h1 className="detail-title">{event.title}</h1>
        <p className="detail-org">{event.organization}</p>

        <div className="detail-meta">
          <div className="meta-item">
            <span className="meta-label">Date</span>
            <span>{formattedDate}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Time</span>
            <span>{event.time}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Location</span>
            <span>{event.location}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Spots Available</span>
            <span>{event.spotsAvailable}</span>
          </div>
        </div>

        <p className="detail-description">{event.description}</p>

        <div className="detail-actions">
          <button className="btn-save">♡ Save Event</button>
          <button className="btn-signup">Sign Up</button>
        </div>
      </div>
    </div>
  )
}

export default EventDetail
