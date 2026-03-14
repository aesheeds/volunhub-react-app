import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useLocalStorage from '../hooks/useLocalStorage'
import useSignups from '../hooks/useSignups'
import './Agenda.css'

function getMonday(date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function addDays(date, n) {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

function toDateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function formatWeekRange(monday) {
  const sunday = addDays(monday, 6)
  const opts = { month: 'short', day: 'numeric' }
  const start = monday.toLocaleDateString('en-US', opts)
  const end = sunday.toLocaleDateString('en-US', { ...opts, year: 'numeric' })
  return `${start} – ${end}`
}

function Agenda() {
  const navigate = useNavigate()
  const [events] = useLocalStorage('volunhub_events', [])
  const { signups, loading, cancelSignup } = useSignups()
  const [confirmingId, setConfirmingId] = useState(null)
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()))

  const thisWeekMonday = getMonday(new Date())
  const isCurrentWeek = toDateKey(weekStart) === toDateKey(thisWeekMonday)

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const signedUpEvents = signups
    .map(signup => ({
      signup,
      event: events.find(e => e.id === signup.event_id)
    }))
    .filter(item => item.event)

  const weekKeys = weekDays.map(toDateKey)
  const weekEvents = signedUpEvents.filter(item => weekKeys.includes(item.event.date))

  const grouped = weekEvents.reduce((acc, item) => {
    const key = item.event.date
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})

  function handleCancel(eventId) {
    cancelSignup(eventId)
    setConfirmingId(null)
  }

  if (loading) return <div className="page-loading">Loading...</div>

  return (
    <div>
      <h1 className="page-title">Agenda</h1>
      <p className="page-subtitle">{weekEvents.length} event{weekEvents.length !== 1 ? 's' : ''} this week</p>

      <div className="week-nav">
        <div className="week-nav-left">
          <button className="btn-week-nav" onClick={() => { setWeekStart(prev => addDays(prev, -7)); setConfirmingId(null) }}>← Prev</button>
        </div>
        <span className="week-range">{formatWeekRange(weekStart)}</span>
        <div className="week-nav-right">
          <button
            className="btn-this-week"
            onClick={() => { setWeekStart(getMonday(new Date())); setConfirmingId(null) }}
            style={{ visibility: isCurrentWeek ? 'hidden' : 'visible' }}
          >
            This Week
          </button>
          <button className="btn-week-nav" onClick={() => { setWeekStart(prev => addDays(prev, 7)); setConfirmingId(null) }}>Next →</button>
        </div>
      </div>

      <div className="agenda-list">
        {weekDays.map(day => {
          const key = toDateKey(day)
          const dayEvents = grouped[key] || []
          const isToday = key === toDateKey(new Date())
          return (
            <div key={key} className={`agenda-day${isToday ? ' agenda-day--today' : ''}${dayEvents.length === 0 ? ' agenda-day--empty' : ''}`}>
              <h2 className="agenda-day-heading">
                {day.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                {isToday && <span className="today-badge">Today</span>}
              </h2>
              {dayEvents.length === 0 ? (
                <p className="agenda-no-events">No events</p>
              ) : (
                <div className="agenda-events">
                  {dayEvents.map(({ signup, event }) => (
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
                      <div className="agenda-item-actions">
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
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Agenda
