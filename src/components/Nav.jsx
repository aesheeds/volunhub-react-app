import { useState, useEffect, useRef } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './Nav.css'

function Nav() {
  const { user, loading } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [navHidden, setNavHidden] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    function handleScroll() {
      const currentY = window.scrollY
      if (currentY < 10) {
        setNavHidden(false)
      } else if (currentY > lastScrollY.current) {
        setNavHidden(true)
        setMenuOpen(false)
      } else {
        setNavHidden(false)
      }
      lastScrollY.current = currentY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <nav className={`nav${navHidden ? ' nav-hidden' : ''}`}>
      <Link to="/" className="nav-logo">
        <img src="/volunhub-logo-white.png" alt="VolunHub" className="nav-logo-icon" />
        <span className="nav-logo-text">olunHub</span>
      </Link>

      {/* Desktop links */}
      <div className="nav-links">
        {!loading && user && <NavLink to="/home">Home</NavLink>}
        {!loading && <NavLink to="/" end>Browse</NavLink>}
        {!loading && user && (
          <>
            <NavLink to="/signups">My Signups</NavLink>
            <NavLink to="/agenda">Agenda</NavLink>
            <NavLink to="/saved">Saved</NavLink>
            <NavLink to="/my-events">My Events</NavLink>
            <NavLink to="/profile" className="nav-profile-icon" title="Profile">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
            </NavLink>
          </>
        )}
        {!loading && !user && <NavLink to="/login" className="nav-login-btn">Log In</NavLink>}
      </div>

      {/* Hamburger button (mobile) */}
      {/* TODO D4: replace with polished hamburger during styling pass */}
      <button className="nav-hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
        ☰
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="nav-mobile-menu">
          {!loading && user && <NavLink to="/home" onClick={closeMenu}>Home</NavLink>}
          {!loading && <NavLink to="/" end onClick={closeMenu}>Browse</NavLink>}
          {!loading && user && (
            <>
              <NavLink to="/signups" onClick={closeMenu}>My Signups</NavLink>
              <NavLink to="/agenda" onClick={closeMenu}>Agenda</NavLink>
              <NavLink to="/saved" onClick={closeMenu}>Saved</NavLink>
              <NavLink to="/my-events" onClick={closeMenu}>My Events</NavLink>
              <NavLink to="/profile" onClick={closeMenu}>Profile</NavLink>
            </>
          )}
          {!loading && !user && <NavLink to="/login" onClick={closeMenu}>Log In</NavLink>}
        </div>
      )}
    </nav>
  )
}

export default Nav
