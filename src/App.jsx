import './App.css'

function App() {
  return (
    <div className="container">
      <header className="hero">
        <h1 className="title">VolunHub</h1>
        <p className="description">
          A volunteering event finder and tracker app. Allows users to easily find and sign up for volunteering events.
        </p>
      </header>

      <main>
        <section className="card">
          <h2>Planned MVP Features</h2>
          <ul className="feature-list">
            <li>Browse events + view event details</li>
            <li>Search + filter by cause, location, date, and type</li>
            <li>Save events for later (favorites)</li>
            <li>Sign up for events + manage signups</li>
            <li>Agenda view of signed-up events grouped by date</li>
          </ul>
        </section>

        <section className="card complete-tier">
          <h2>Complete Tier <span className="badge">Later</span></h2>
          <p className="tier-note">Powered by Supabase Auth + Supabase Database</p>
          <ul className="feature-list">
            <li>Users can create profiles with personal info, volunteering preferences, and skills</li>
            <li>Signed-in users access a home page with recommended events based on their preferences</li>
          </ul>
        </section>
      </main>
    </div>
  )
}

export default App
