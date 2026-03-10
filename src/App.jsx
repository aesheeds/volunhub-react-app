import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Browse from './pages/Browse'
import EventDetail from './pages/EventDetail'
import Saved from './pages/Saved'
import Signups from './pages/Signups'
import Agenda from './pages/Agenda'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <main className="page-content">
        <Routes>
          <Route path="/" element={<Browse />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/signups" element={<Signups />} />
          <Route path="/agenda" element={<Agenda />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
