import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await signIn(email, password)
      navigate('/home')
    } catch (err) {
      const msg = err.message || ''
      if (msg.toLowerCase().includes('invalid login credentials')) {
        setError('Wrong email or password.')
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
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Log in to your VolunHub account</p>

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

          <label className="auth-label">
            Password
            <input
              type="password"
              className="auth-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </label>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
        <p className="auth-back">
          <Link to="/">← Back to Browse</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
