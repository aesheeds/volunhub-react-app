import { useState } from 'react'
import './FilterBar.css'

function PillGroup({ label, options, selected, onToggle }) {
  return (
    <div className="pill-group">
      <span className="pill-label">{label}</span>
      <div className="pills">
        {options.map(option => (
          <button
            key={option}
            className={`pill ${selected.includes(option) ? 'pill-active' : ''}`}
            onClick={() => onToggle(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

function FilterBar({ events, filters, onFilterChange }) {
  const [expanded, setExpanded] = useState(false)

  const causes = [...new Set(events.map(e => e.cause))].sort()
  const locations = [...new Set(events.map(e => e.location))].sort()
  const types = [...new Set(events.map(e => e.type))].sort()

  const activeCount = filters.causes.length + filters.locations.length + filters.types.length

  function toggleOption(key, value) {
    const current = filters[key]
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]
    onFilterChange(key, updated)
  }

  return (
    <div className="filter-bar">
      <div className="filter-top-row">
        <input
          className="search-input"
          type="text"
          placeholder="Search events or organizations..."
          value={filters.search}
          onChange={e => onFilterChange('search', e.target.value)}
        />
        <button
          className={`filter-toggle ${expanded ? 'filter-toggle-active' : ''}`}
          onClick={() => setExpanded(prev => !prev)}
        >
          Filters {activeCount > 0 && <span className="filter-badge">{activeCount}</span>}
          <span className="filter-chevron">{expanded ? '▲' : '▼'}</span>
        </button>
      </div>

      {expanded && (
        <div className="filter-panel">
          <PillGroup label="Cause" options={causes} selected={filters.causes} onToggle={v => toggleOption('causes', v)} />
          <PillGroup label="Location" options={locations} selected={filters.locations} onToggle={v => toggleOption('locations', v)} />
          <PillGroup label="Type" options={types} selected={filters.types} onToggle={v => toggleOption('types', v)} />
          {activeCount > 0 && (
            <button className="clear-filters" onClick={() => {
              onFilterChange('causes', [])
              onFilterChange('locations', [])
              onFilterChange('types', [])
            }}>
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default FilterBar
