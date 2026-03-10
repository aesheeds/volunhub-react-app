import { NavLink } from 'react-router-dom'
import './Nav.css'

function Nav() {
  return (
    <nav className="nav">
      <span className="nav-logo">VolunHub</span>
      <div className="nav-links">
        <NavLink to="/" end>Browse</NavLink>
        <NavLink to="/saved">Saved</NavLink>
        <NavLink to="/signups">My Signups</NavLink>
        <NavLink to="/agenda">Agenda</NavLink>
      </div>
    </nav>
  )
}

export default Nav
