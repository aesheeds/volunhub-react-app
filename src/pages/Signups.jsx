import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useLocalStorage from '../hooks/useLocalStorage'
import useSignups from '../hooks/useSignups'
import './Signups.css'

function Signups() {
  const navigate = useNavigate()
  const [events] = useLocalStorage('volunhub_events', [])
  const { signups, cancelSignup } = useSignups()
  const [confirmingId, setConfirmingId] = useState(null)

  const signedUpEvents = signups
    .map(signup => ({
      signup,
      event: events.find(e => e.id === signup.eventId)
    }))
    .filter(item => item.event)
    .sort((a, b) => new Date(a.event.date) - new Date(b.event.date))

  function handleCancel(eventId) {
    cancelSignup(eventId)
    setConfirmingId(null)
  }

  return (
    <div>
      <h1 className="page-title">My Signups</h1>
      <p className="page-subtitle">{signedUpEvents.length} event{signedUpEvents.length !== 1 ? 's' : ''} signed up</p>

      {signedUpEvents.length > 0
        ? <div className="signup-list">
            {signedUpEvents.map(({ signup, event }) => (
              <div key={signup.id} className="signup-item">
                <div className="signup-item-info" onClick={() => navigate(`/events/${event.id}`)}>
                  <div className="signup-item-tags">
                    <span className="cause-tag">{event.cause}</span>
                    <span className="type-tag">{event.type}</span>
                  </div>
                  <h3 className="signup-item-title">{event.title}</h3>
                  <p className="signup-item-org">{event.organization}</p>
                  <div className="signup-item-meta">
                    <span>📍 {event.location}</span>
                    <span>📅 {new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span>🕐 {event.time}</span>
                  </div>
                  {signup.note && (
                    <p className="signup-note">📝 {signup.note}</p>
                  )}
                </div>
                <div className="signup-item-actions">
                  {confirmingId === signup.id ? (
                    <div className="cancel-confirm">
                      <p className="cancel-confirm-text">Cancel signup?</p>
                      <div className="cancel-confirm-btns">
                        <button className="btn-confirm-yes" onClick={() => handleCancel(event.id)}>Yes</button>
                        <button className="btn-confirm-no" onClick={() => setConfirmingId(null)}>No</button>
                      </div>
                    </div>
                  ) : (
                    <button className="btn-cancel-signup" onClick={() => setConfirmingId(signup.id)}>
                      Cancel Signup
                    </button>
                  )}
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

export default Signups
