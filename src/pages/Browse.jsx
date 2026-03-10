import { useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import EventCard from '../components/EventCard'
import FilterBar from '../components/FilterBar'
import './Browse.css'

const DEFAULT_FILTERS = { search: '', causes: [], locations: [], types: [] }

function Browse() {
  const [events] = useLocalStorage('volunhub_events', [])
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  function handleFilterChange(key, value) {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date))

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
      <FilterBar events={events} filters={filters} onFilterChange={handleFilterChange} />
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
