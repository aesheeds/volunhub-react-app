import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './Nav.css'

function Nav() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleSignOut() {
    await signOut()
    setMenuOpen(false)
    navigate('/')
  }

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <nav className="nav">
      <span className="nav-logo">VolunHub</span>

      {/* Desktop links */}
      <div className="nav-links">
        <NavLink to="/" end>Browse</NavLink>
        {user && (
          <>
            <NavLink to="/saved">Saved</NavLink>
            <NavLink to="/signups">My Signups</NavLink>
            <NavLink to="/agenda">Agenda</NavLink>
            <NavLink to="/profile">Profile</NavLink>
            {/* TODO C1: remove once logout lives on Profile page */}
            <button className="nav-logout-btn" onClick={handleSignOut}>Log Out</button>
          </>
        )}
        {!user && <NavLink to="/login" className="nav-login-btn">Log In</NavLink>}
      </div>

      {/* Hamburger button (mobile) */}
      {/* TODO D4: replace with polished hamburger during styling pass */}
      <button className="nav-hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
        ☰
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="nav-mobile-menu">
          <NavLink to="/" end onClick={closeMenu}>Browse</NavLink>
          {user && (
            <>
              <NavLink to="/saved" onClick={closeMenu}>Saved</NavLink>
              <NavLink to="/signups" onClick={closeMenu}>My Signups</NavLink>
              <NavLink to="/agenda" onClick={closeMenu}>Agenda</NavLink>
              <NavLink to="/profile" onClick={closeMenu}>Profile</NavLink>
              <button className="nav-mobile-logout" onClick={handleSignOut}>Log Out</button>
            </>
          )}
          {!user && <NavLink to="/login" onClick={closeMenu}>Log In</NavLink>}
        </div>
      )}
    </nav>
  )
}

export default Nav
