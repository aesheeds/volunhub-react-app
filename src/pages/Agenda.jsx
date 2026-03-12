import { useNavigate } from 'react-router-dom'
import useLocalStorage from '../hooks/useLocalStorage'
import useSignups from '../hooks/useSignups'
import './Agenda.css'

function Agenda() {
  const navigate = useNavigate()
  const [events] = useLocalStorage('volunhub_events', [])
  const { signups } = useSignups()

  const signedUpEvents = signups
    .map(signup => ({
      signup,
      event: events.find(e => e.id === signup.eventId)
    }))
    .filter(item => item.event)
    .sort((a, b) => new Date(a.event.date) - new Date(b.event.date))

  const grouped = signedUpEvents.reduce((acc, item) => {
    const key = item.event.date
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})
  const sortedDates = Object.keys(grouped).sort()

  return (
    <div>
      <h1 className="page-title">Agenda</h1>
      <p className="page-subtitle">{signedUpEvents.length} event{signedUpEvents.length !== 1 ? 's' : ''} signed up</p>

      {sortedDates.length > 0
        ? <div className="agenda-list">
            {sortedDates.map(date => (
              <div key={date} className="agenda-date-group">
                <h2 className="agenda-date-heading">
                  {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </h2>
                <div className="agenda-events">
                  {grouped[date].map(({ signup, event }) => (
                    <div key={signup.id} className="agenda-item">
                      <div className="agenda-item-info" onClick={() => navigate(`/events/${event.id}`)}>
                        <div className="agenda-item-tags">
                          <span className="cause-tag">{event.cause}</span>
                          <span className="type-tag">{event.type}</span>
                        </div>
                        <h3 className="agenda-item-title">{event.title}</h3>
                        <p className="agenda-item-org">{event.organization}</p>
                        <div className="agenda-item-meta">
                          <span>📍 {event.location}</span>
                          <span>🕐 {event.time}</span>
                        </div>
                        {signup.note && (
                          <p className="agenda-note">📝 {signup.note}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        : <div className="empty-state">
            <p>You haven't signed up for any events yet.</p>
            <p>Browse events and click <strong>Sign Up</strong> to register.</p>
          </div>
      }
    </div>
  )
}

export default Agenda
