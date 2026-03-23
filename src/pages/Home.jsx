import { Link } from 'react-router-dom'
import { useProfileContext } from '../context/ProfileContext'
import useLocalStorage from '../hooks/useLocalStorage'
import EventCard from '../components/EventCard'
import Spinner from '../components/Spinner'
import './Home.css'

function Home() {
  const { profile, loading } = useProfileContext()
  const [events] = useLocalStorage('volunhub_events', [])

  if (loading || !profile) return <Spinner />

  const hasPreferences = profile &&
    (profile.causes.length > 0 || profile.locations.length > 0 || profile.types.length > 0)

  const greeting = profile?.firstName ? `Welcome back, ${profile.firstName}!` : 'Welcome back!'

  // No preferences set yet
  if (!hasPreferences) {
    return (
      <div>
        <h1 className="page-title">{greeting}</h1>
        <div className="home-empty">
          <p className="home-empty-text">
            You haven't set any volunteering preferences yet. Tell us what you care about and we'll recommend events tailored for you.
          </p>
          <Link to="/profile" className="home-cta-btn">Set up your preferences</Link>
        </div>
      </div>
    )
  }

  // Filter events by preferences — same logic as Browse
  const recommended = [...events]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .filter(event => {
      const matchesCause = profile.causes.length === 0 || profile.causes.includes(event.cause)
      const matchesLocation = profile.locations.length === 0 || profile.locations.includes(event.location)
      const matchesType = profile.types.length === 0 || profile.types.includes(event.type)
      return matchesCause && matchesLocation && matchesType
    })

  // Preferences set but nothing matches
  if (recommended.length === 0) {
    return (
      <div>
        <h1 className="page-title">{greeting}</h1>
        <div className="home-empty">
          <p className="home-empty-text">
            No upcoming events match your current preferences. Try updating them or browse everything.
          </p>
          <div className="home-empty-actions">
            <Link to="/profile" className="home-cta-btn">Update preferences</Link>
            <Link to="/" className="home-browse-link">Browse all events</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="page-title">{greeting}</h1>
      <p className="page-subtitle">
        {recommended.length} event{recommended.length !== 1 ? 's' : ''} recommended for you ·{' '}
        <Link to="/" className="home-browse-all">Browse all events</Link>
      </p>
      <div className="events-grid">
        {recommended.map(event => <EventCard key={event.id} event={event} />)}
      </div>
    </div>
  )
}

export default Home
