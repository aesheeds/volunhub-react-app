import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './Nav.css'

function Nav() {
  const { user } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <nav className="nav">
      <Link to="/" className="nav-logo">
        <img src="/volunhub-logo-white.png" alt="VolunHub" className="nav-logo-icon" />
        <span className="nav-logo-text">olunHub</span>
      </Link>

      {/* Desktop links */}
      <div className="nav-links">
        {user && <NavLink to="/home">Home</NavLink>}
        <NavLink to="/" end>Browse</NavLink>
        {user && (
          <>
            <NavLink to="/signups">My Signups</NavLink>
            <NavLink to="/agenda">Agenda</NavLink>
            <NavLink to="/saved">Saved</NavLink>
            <NavLink to="/profile">Profile</NavLink>
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
          {user && <NavLink to="/home" onClick={closeMenu}>Home</NavLink>}
          <NavLink to="/" end onClick={closeMenu}>Browse</NavLink>
          {user && (
            <>
              <NavLink to="/signups" onClick={closeMenu}>My Signups</NavLink>
              <NavLink to="/agenda" onClick={closeMenu}>Agenda</NavLink>
              <NavLink to="/saved" onClick={closeMenu}>Saved</NavLink>
              <NavLink to="/profile" onClick={closeMenu}>Profile</NavLink>
            </>
          )}
          {!user && <NavLink to="/login" onClick={closeMenu}>Log In</NavLink>}
        </div>
      )}
    </nav>
  )
}

export default Nav
