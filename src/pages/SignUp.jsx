import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './Login.css'

function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const reqs = {
    length: password.length >= 6,
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
    match: password.length > 0 && password === confirm,
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    if (!/\d/.test(password)) {
      setError('Password must contain at least one number.')
      return
    }
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      setError('Password must contain at least one special character.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      await signUp(email, password)
      navigate('/profile?welcome=true')
    } catch (err) {
      const msg = err.message || ''
      if (msg.toLowerCase().includes('user already registered')) {
        setError('An account with this email already exists.')
      } else if (msg.toLowerCase().includes('fetch') || msg.toLowerCase().includes('network')) {
        setError('Connection error. Please check your internet and try again.')
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <Link to="/" className="auth-brand">
        <img src="/volunhub-logo-white.png" alt="VolunHub logo" className="auth-logo" />
        <span className="auth-brand-name">VolunHub</span>
      </Link>

      <div className="auth-card">
        <h1 className="auth-title">Create an account</h1>
        <p className="auth-subtitle">Join VolunHub to save and sign up for events</p>

        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-label">
            Email
            <input
              type="email"
              className="auth-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
          </label>

          <div className="auth-label-group">
            <label className="auth-label">
              Password
              <input
                type="password"
                className="auth-input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </label>
            {password.length > 0 && (
              <ul className="auth-req-list">
                <li className={reqs.length ? 'req-met' : 'req-unmet'}>At least 6 characters</li>
                <li className={reqs.number ? 'req-met' : 'req-unmet'}>Contains a number</li>
                <li className={reqs.special ? 'req-met' : 'req-unmet'}>Contains a special character</li>
              </ul>
            )}
          </div>

          <label className="auth-label">
            Confirm Password
            <input
              type="password"
              className="auth-input"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              minLength={6}
            />
            {confirm.length > 0 && (
              <span className={reqs.match ? 'req-met' : 'req-unmet'}>
                {reqs.match ? 'Passwords match' : 'Passwords do not match'}
              </span>
            )}
          </label>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
        <p className="auth-back">
          <Link to="/">← Back to Browse</Link>
        </p>
      </div>
    </div>
  )
}

export default SignUp
