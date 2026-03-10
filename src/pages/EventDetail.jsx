import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useLocalStorage from '../hooks/useLocalStorage'
import useSaved from '../hooks/useSaved'
import useSignups from '../hooks/useSignups'
import './EventDetail.css'

function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [events] = useLocalStorage('volunhub_events', [])
  const { isSaved, toggleSaved } = useSaved()
  const { isSignedUp, addSignup, cancelSignup, getSignupCountForEvent } = useSignups()
  const [showForm, setShowForm] = useState(false)
  const [note, setNote] = useState('')

  const event = events.find(e => e.id === id)

  if (!event) {
    return (
      <div className="not-found">
        <h2>Event not found.</h2>
        <button onClick={() => navigate(-1)}>Back to Browse</button>
      </div>
    )
  }

  const formattedDate = new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  })

  const remainingSpots = event.spotsAvailable - getSignupCountForEvent(event.id)
  const signedUp = isSignedUp(event.id)
  const full = remainingSpots <= 0

  function handleConfirmSignup() {
    addSignup(event.id, note)
    setNote('')
    setShowForm(false)
  }

  return (
    <div className="event-detail">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

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
            <span className={remainingSpots === 0 ? 'spots-full' : ''}>{remainingSpots}</span>
          </div>
        </div>

        <p className="detail-description">{event.description}</p>

        <div className="detail-actions">
          <button
            className={`btn-save ${isSaved(event.id) ? 'saved' : ''}`}
            onClick={() => toggleSaved(event.id)}
          >
            {isSaved(event.id) ? '♥ Saved' : '♡ Save Event'}
          </button>

          {signedUp ? (
            <button className="btn-signup signed-up" onClick={() => cancelSignup(event.id)}>
              ✓ Signed Up — Cancel
            </button>
          ) : (
            <button
              className="btn-signup"
              onClick={() => setShowForm(prev => !prev)}
              disabled={full}
            >
              {full ? 'Event Full' : 'Sign Up'}
            </button>
          )}
        </div>

        {showForm && !signedUp && (
          <div className="signup-form">
            <label className="signup-label">Note <span className="optional">(optional)</span></label>
            <textarea
              className="signup-textarea"
              placeholder="Any notes for the organizer..."
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={3}
            />
            <div className="signup-form-actions">
              <button className="btn-confirm" onClick={handleConfirmSignup}>Confirm Sign Up</button>
              <button className="btn-cancel-form" onClick={() => { setShowForm(false); setNote('') }}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EventDetail
