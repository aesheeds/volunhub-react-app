import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './Login.css'

function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [resendStatus, setResendStatus] = useState(null)
  const { signUp, resendConfirmation } = useAuth()

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
      setConfirmed(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    setResendStatus('sending')
    try {
      await resendConfirmation(email)
      setResendStatus('sent')
    } catch {
      setResendStatus('error')
    }
  }

  if (confirmed) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Check your email</h1>
          <p className="auth-subtitle">We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.</p>
          <button
            className="auth-btn"
            style={{ marginTop: '1.5rem' }}
            onClick={handleResend}
            disabled={resendStatus === 'sending' || resendStatus === 'sent'}
          >
            {resendStatus === 'sending' ? 'Sending...' : resendStatus === 'sent' ? 'Email sent!' : 'Resend confirmation email'}
          </button>
          {resendStatus === 'error' && <p className="auth-error">Failed to resend. Try again.</p>}
          <p className="auth-switch" style={{ marginTop: '1rem' }}>
            Already confirmed? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-container">
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
            <span className="auth-hint">At least 6 characters, including a number and a special character</span>
          </label>

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
          </label>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  )
}

export default SignUp
