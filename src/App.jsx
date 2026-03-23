import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { SignupsProvider } from './context/SignupsContext'
import { SavedProvider } from './context/SavedContext'
import { ProfileProvider } from './context/ProfileContext'
import Nav from './components/Nav'
import Browse from './pages/Browse'
import EventDetail from './pages/EventDetail'
import Saved from './pages/Saved'
import Signups from './pages/Signups'
import Agenda from './pages/Agenda'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import eventsData from './data/events.json'
import './App.css'

if (!localStorage.getItem('volunhub_events')) {
  localStorage.setItem('volunhub_events', JSON.stringify(eventsData))
}

function AppContent() {
  const location = useLocation()
  const isAuthPage = ['/login', '/signup'].includes(location.pathname)

  return (
    <>
      {!isAuthPage && <Nav />}
      <main className={isAuthPage ? '' : 'page-content'}>
        <Routes>
          <Route path="/" element={<Browse />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/saved" element={<ProtectedRoute><Saved /></ProtectedRoute>} />
          <Route path="/signups" element={<ProtectedRoute><Signups /></ProtectedRoute>} />
          <Route path="/agenda" element={<ProtectedRoute><Agenda /></ProtectedRoute>} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </main>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <SignupsProvider>
      <SavedProvider>
      <ProfileProvider>
        <AppContent />
      </ProfileProvider>
      </SavedProvider>
      </SignupsProvider>
    </BrowserRouter>
  )
}

export default App
