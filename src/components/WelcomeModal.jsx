import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './WelcomeModal.css'

const WELCOMED_KEY = 'volunhub_welcomed'

function WelcomeModal() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [dismissed, setDismissed] = useState(false)

  const visible = !loading && !user && !dismissed && !localStorage.getItem(WELCOMED_KEY)

  function dismiss() {
    localStorage.setItem(WELCOMED_KEY, 'true')
    setDismissed(true)
  }

  function handleSignUp() {
    dismiss()
    navigate('/signup')
  }

  if (!visible) return null

  return (
    <div className="wm-overlay" onClick={dismiss}>
      <div className="wm-modal" onClick={e => e.stopPropagation()}>
        <button className="wm-close" onClick={dismiss} aria-label="Close">✕</button>

        <img src="/volunhub-logo.png" alt="VolunHub" className="wm-logo" />
        <h1 className="wm-title">Welcome to VolunHub</h1>
        <p className="wm-description">
          Discover local volunteer events, track your signups, and make an impact in your community — all in one place.
        </p>

        <div className="wm-actions">
          <button className="wm-btn-primary" onClick={handleSignUp}>Sign Up Free</button>
          <button className="wm-btn-secondary" onClick={dismiss}>Browse Events</button>
        </div>
      </div>
    </div>
  )
}

export default WelcomeModal
