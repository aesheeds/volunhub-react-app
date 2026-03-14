import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SignupsProvider } from './context/SignupsContext'
import { SavedProvider } from './context/SavedContext'
import Nav from './components/Nav'
import Browse from './pages/Browse'
import EventDetail from './pages/EventDetail'
import Saved from './pages/Saved'
import Signups from './pages/Signups'
import Agenda from './pages/Agenda'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import ProtectedRoute from './components/ProtectedRoute'
import eventsData from './data/events.json'
import './App.css'

if (!localStorage.getItem('volunhub_events')) {
  localStorage.setItem('volunhub_events', JSON.stringify(eventsData))
}

function App() {
  return (
    <BrowserRouter>
      <SignupsProvider>
      <SavedProvider>
        <Nav />
        <main className="page-content">
          <Routes>
            <Route path="/" element={<Browse />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/saved" element={<ProtectedRoute><Saved /></ProtectedRoute>} />
            <Route path="/signups" element={<ProtectedRoute><Signups /></ProtectedRoute>} />
            <Route path="/agenda" element={<ProtectedRoute><Agenda /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </main>
      </SavedProvider>
      </SignupsProvider>
    </BrowserRouter>
  )
}

export default App
