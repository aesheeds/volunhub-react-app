import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useProfileContext } from '../context/ProfileContext'
import { supabase } from '../lib/supabase'
import eventsData from '../data/events.json'
import './Profile.css'

const CAUSES = [...new Set(eventsData.map(e => e.cause))].sort()
const LOCATIONS = [...new Set(eventsData.map(e => e.location))].sort()
const TYPES = [...new Set(eventsData.map(e => e.type))].sort()

function PillGroup({ label, options, selected, onToggle }) {
  return (
    <div className="profile-pill-group">
      <span className="profile-pill-label">{label}</span>
      <div className="profile-pills">
        {options.map(option => (
          <button
            key={option}
            className={`profile-pill ${selected.includes(option) ? 'profile-pill-active' : ''}`}
            onClick={() => onToggle(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

function Profile() {
  const { user, loading: authLoading, signOut } = useAuth()
  const { profile, loading, updateProfile } = useProfileContext()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isNewUser = searchParams.get('welcome') === 'true'

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [causes, setCauses] = useState([])
  const [locations, setLocations] = useState([])
  const [types, setTypes] = useState([])
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState(null)
  const [error, setError] = useState(null)
  const [confirmingClear, setConfirmingClear] = useState(false)
  const [clearing, setClearing] = useState(false)

  // Sync local form state from context whenever profile loads
  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName)
      setLastName(profile.lastName)
      setCauses(profile.causes)
      setLocations(profile.locations)
      setTypes(profile.types)
    }
  }, [profile])

  function toggle(setter, value) {
    setter(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    )
  }

  async function handleSave() {
    setSaving(true)
    setError(null)
    setSaveStatus(null)

    const { error } = await updateProfile({ firstName, lastName, causes, locations, types })

    setSaving(false)
    if (error) {
      setError(error.message)
      setSaveStatus('error')
    } else if (isNewUser) {
      navigate('/home')
    } else {
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus(null), 2500)
    }
  }

  async function handleClearData() {
    setClearing(true)
    const results = await Promise.all([
      supabase.from('profiles').delete().eq('id', user.id),
      supabase.from('signups').delete().eq('user_id', user.id),
      supabase.from('saved_events').delete().eq('user_id', user.id),
    ])
    const failed = results.find(r => r.error)
    if (failed) {
      setError('Something went wrong clearing your data. Please try again.')
      setClearing(false)
      setConfirmingClear(false)
      return
    }
    window.location.replace('/profile?welcome=true')
  }

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  if (authLoading || loading || !profile) return <p className="profile-loading">Loading profile...</p>

  return (
    <div className="profile-container">
      <div className="profile-card">

        {isNewUser && (
          <div className="profile-welcome">
            Welcome to VolunHub! Fill in your name and pick your preferences so we can recommend events for you.
          </div>
        )}

        <h1 className="profile-title">Your Profile</h1>

        {/* Account info */}
        <div className="profile-section">
          <h2 className="profile-section-title">Account</h2>

          <label className="profile-label">
            Email
            <input
              className="profile-input profile-input-readonly"
              value={user.email}
              readOnly
            />
          </label>

          <div className="profile-name-row">
            <label className="profile-label">
              First Name
              <input
                className="profile-input"
                type="text"
                placeholder="First name"
                value={firstName}
                maxLength={50}
                onChange={e => setFirstName(e.target.value)}
              />
            </label>
            <label className="profile-label">
              Last Name
              <input
                className="profile-input"
                type="text"
                placeholder="Last name"
                value={lastName}
                maxLength={50}
                onChange={e => setLastName(e.target.value)}
              />
            </label>
          </div>
        </div>

        {/* Preferences */}
        <div className="profile-section">
          <h2 className="profile-section-title">Volunteering Preferences</h2>
          <p className="profile-section-subtitle">
            Pick the causes, locations, and types you care about. We'll use these to recommend events for you.
          </p>

          <PillGroup
            label="Causes"
            options={CAUSES}
            selected={causes}
            onToggle={v => toggle(setCauses, v)}
          />
          <PillGroup
            label="Locations"
            options={LOCATIONS}
            selected={locations}
            onToggle={v => toggle(setLocations, v)}
          />
          <PillGroup
            label="Types"
            options={TYPES}
            selected={types}
            onToggle={v => toggle(setTypes, v)}
          />
        </div>

        {error && <p className="profile-error">{error}</p>}

        <button
          className={`profile-save-btn ${saveStatus === 'saved' ? 'profile-save-btn-saved' : ''}`}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Profile'}
        </button>

        <hr className="profile-divider" />

        <button className="profile-signout-btn" onClick={handleSignOut}>
          Log Out
        </button>

        <hr className="profile-divider" />

        <div className="profile-clear-section">
          <p className="profile-clear-label">Clear My Data</p>
          <p className="profile-clear-hint">
            Removes your name, preferences, signups, and saved events. Your login (email & password) will not be affected — you can set everything up again after.
          </p>

          {confirmingClear ? (
            <div className="profile-clear-confirm">
              <p className="profile-clear-confirm-text">Are you sure? This cannot be undone.</p>
              <div className="profile-clear-confirm-btns">
                <button
                  className="profile-clear-yes"
                  onClick={handleClearData}
                  disabled={clearing}
                >
                  {clearing ? 'Clearing...' : 'Yes, clear my data'}
                </button>
                <button
                  className="profile-clear-no"
                  onClick={() => setConfirmingClear(false)}
                  disabled={clearing}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              className="profile-clear-btn"
              onClick={() => setConfirmingClear(true)}
            >
              Clear My Data
            </button>
          )}
        </div>

      </div>
    </div>
  )
}

export default Profile
