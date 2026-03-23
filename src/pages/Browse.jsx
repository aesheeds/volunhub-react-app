import { useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import useSignups from '../hooks/useSignups'
import EventCard from '../components/EventCard'
import FilterBar from '../components/FilterBar'
import './Browse.css'

const DEFAULT_FILTERS = { search: '', causes: [], locations: [], types: [] }

function Browse() {
  const [events] = useLocalStorage('volunhub_events', [])
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [sortBy, setSortBy] = useState('date')
  const { getSignupCountForEvent } = useSignups()

  function handleFilterChange(key, value) {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const sortedEvents = [...events].sort((a, b) => {
    if (sortBy === 'spots') {
      const aSpots = a.spotsAvailable - getSignupCountForEvent(a.id)
      const bSpots = b.spotsAvailable - getSignupCountForEvent(b.id)
      return bSpots - aSpots
    }
    if (sortBy === 'az') return a.title.localeCompare(b.title)
    return new Date(a.date) - new Date(b.date)
  })

  const filteredEvents = sortedEvents.filter(event => {
    const matchesSearch =
      event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      event.organization.toLowerCase().includes(filters.search.toLowerCase())
    const matchesCause = filters.causes.length === 0 || filters.causes.includes(event.cause)
    const matchesLocation = filters.locations.length === 0 || filters.locations.includes(event.location)
    const matchesType = filters.types.length === 0 || filters.types.includes(event.type)
    return matchesSearch && matchesCause && matchesLocation && matchesType
  })

  const isFiltered = filteredEvents.length !== events.length

  return (
    <div>
      <h1 className="page-title">Browse Events</h1>
      <p className="page-subtitle">
        {isFiltered ? `${filteredEvents.length} of ${events.length} events` : `${events.length} events available`}
      </p>
      <FilterBar events={events} filters={filters} onFilterChange={handleFilterChange} sortBy={sortBy} onSortChange={setSortBy} />
      <div className="events-grid">
        {filteredEvents.length > 0
          ? filteredEvents.map(event => <EventCard key={event.id} event={event} />)
          : <p className="no-results">No events match your search.</p>
        }
      </div>
    </div>
  )
}

export default Browse
