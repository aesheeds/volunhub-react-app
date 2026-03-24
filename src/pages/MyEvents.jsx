import { useState, useRef } from 'react'
import { useAuth } from '../hooks/useAuth'
import useSignups from '../hooks/useSignups'
import causeImages from '../utils/causeImages'
import './MyEvents.css'

const CAUSES = ['Environment', 'Education', 'Food & Hunger', 'Animals', 'Community', 'Health']
const TYPES = ['In-Person', 'Virtual', 'Hybrid']

const emptyForm = {
  title: '',
  organization: '',
  cause: CAUSES[0],
  location: '',
  date: '',
  time: '',
  type: TYPES[0],
  description: '',
  spotsAvailable: '',
  image: '',
}

function getStoredEvents() {
  return JSON.parse(localStorage.getItem('volunhub_events') || '[]')
}

function saveStoredEvents(events) {
  localStorage.setItem('volunhub_events', JSON.stringify(events))
}

function MyEvents() {
  const { user } = useAuth()
  const { getSignupCountForEvent } = useSignups()
  const [events, setEvents] = useState(getStoredEvents)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [confirmingDelete, setConfirmingDelete] = useState(null)
  const formRef = useRef(null)

  const myEvents = events
    .filter(e => e.createdBy === user?.id)
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const all = getStoredEvents()

    if (editingId) {
      const updated = all.map(ev =>
        ev.id === editingId
          ? {
              ...ev,
              ...formData,
              spotsAvailable: Number(formData.spotsAvailable),
              image: formData.image || causeImages[formData.cause] || '',
            }
          : ev
      )
      saveStoredEvents(updated)
      setEvents(updated)
    } else {
      const newEvent = {
        ...formData,
        id: `user-${user.id.slice(0, 8)}-${Date.now()}`,
        createdBy: user.id,
        spotsAvailable: Number(formData.spotsAvailable),
        image: formData.image || causeImages[formData.cause] || '',
      }
      const updated = [...all, newEvent]
      saveStoredEvents(updated)
      setEvents(updated)
    }

    setFormData(emptyForm)
    setEditingId(null)
    setShowForm(false)
  }

  function handleEdit(ev) {
    setFormData({
      title: ev.title,
      organization: ev.organization,
      cause: ev.cause,
      location: ev.location,
      date: ev.date,
      time: ev.time,
      type: ev.type,
      description: ev.description,
      spotsAvailable: String(ev.spotsAvailable),
      image: ev.image || '',
    })
    setEditingId(ev.id)
    setShowForm(true)
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  function handleDelete(id) {
    const updated = getStoredEvents().filter(e => e.id !== id)
    saveStoredEvents(updated)
    setEvents(updated)
    setConfirmingDelete(null)
  }

  function handleCancelForm() {
    setFormData(emptyForm)
    setEditingId(null)
    setShowForm(false)
  }

  function handlePostNew() {
    setFormData(emptyForm)
    setEditingId(null)
    setShowForm(true)
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  return (
    <div className="my-events-page">
      <div className="my-events-header">
        <h1 className="page-title">My Events</h1>
        <p className="page-subtitle">{myEvents.length} event{myEvents.length !== 1 ? 's' : ''} posted</p>
        {!showForm && (
          <button className="me-btn-primary" onClick={handlePostNew}>
            + Post New Event
          </button>
        )}
      </div>

      {showForm && (
        <div className="me-form-card" ref={formRef}>
          <h2>{editingId ? 'Edit Event' : 'Post a New Event'}</h2>
          <form onSubmit={handleSubmit} className="me-form">

            <div className="me-form-row">
              <div className="me-form-group">
                <label>Event Title *</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Beach Cleanup Drive"
                />
              </div>
              <div className="me-form-group">
                <label>Organization *</label>
                <input
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Ocean Guardians"
                />
              </div>
            </div>

            <div className="me-form-row">
              <div className="me-form-group">
                <label>Cause *</label>
                <select name="cause" value={formData.cause} onChange={handleChange}>
                  {CAUSES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="me-form-group">
                <label>Type *</label>
                <select name="type" value={formData.type} onChange={handleChange}>
                  {TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="me-form-row">
              <div className="me-form-group">
                <label>Location *</label>
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Miami, FL"
                />
              </div>
              <div className="me-form-group me-form-row-half">
                <div className="me-form-group">
                  <label>Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="me-form-group">
                  <label>Time *</label>
                  <input
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    placeholder="e.g. 9:00 AM"
                  />
                </div>
              </div>
            </div>

            <div className="me-form-row">
              <div className="me-form-group">
                <label>Spots Available *</label>
                <input
                  type="number"
                  name="spotsAvailable"
                  value={formData.spotsAvailable}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="e.g. 20"
                />
              </div>
              <div className="me-form-group">
                <label>
                  Image URL{' '}
                  <span className="me-form-optional">(optional — auto-assigned if blank)</span>
                </label>
                <input
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="me-form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Describe your event, what volunteers will do, what to bring, etc."
              />
            </div>

            <div className="me-form-actions">
              <button type="submit" className="me-btn-primary">
                {editingId ? 'Save Changes' : 'Post Event'}
              </button>
              <button type="button" className="me-btn-secondary" onClick={handleCancelForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="me-list">
        {myEvents.length === 0 ? (
          <div className="me-empty">
            <p>You haven't posted any events yet.</p>
            {!showForm && (
              <p>Click <strong>Post New Event</strong> above to get started!</p>
            )}
          </div>
        ) : (
          myEvents.map(ev => (
            <div key={ev.id} className="me-item">
              <div className="me-item-img">
                <img
                  src={ev.image}
                  alt={ev.title}
                  onError={e => { e.target.src = causeImages[ev.cause] || '' }}
                />
              </div>
              <div className="me-item-info">
                <div className="me-item-tags">
                  <span className="cause-tag">{ev.cause}</span>
                  <span className="type-tag">{ev.type}</span>
                </div>
                <h3>{ev.title}</h3>
                <p className="me-item-meta">{ev.organization} · {ev.location}</p>
                <p className="me-item-meta">
                  {new Date(ev.date + 'T00:00:00').toLocaleDateString('en-US', {
                    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
                  })} · {ev.time} · {Math.max(0, ev.spotsAvailable - getSignupCountForEvent(ev.id))} spots remaining
                </p>
              </div>
              <div className="me-item-actions">
                <button className="me-btn-edit" onClick={() => handleEdit(ev)}>
                  Edit
                </button>
                {confirmingDelete === ev.id ? (
                  <div className="cancel-confirm">
                    <p className="cancel-confirm-text">Delete this event?</p>
                    <div className="cancel-confirm-btns">
                      <button className="btn-confirm-yes" onClick={() => handleDelete(ev.id)}>
                        Yes, delete
                      </button>
                      <button className="btn-confirm-no" onClick={() => setConfirmingDelete(null)}>
                        No, keep
                      </button>
                    </div>
                  </div>
                ) : (
                  <button className="btn-cancel-signup" onClick={() => setConfirmingDelete(ev.id)}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default MyEvents
