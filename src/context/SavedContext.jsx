import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

const SavedContext = createContext(null)

export function SavedProvider({ children }) {
  const { user } = useAuth()
  const [savedIds, setSavedIds] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function fetchSaved() {
      if (!user) {
        setSavedIds([])
        setLoading(false)
        return
      }
      setLoading(true)
      const { data } = await supabase
        .from('saved_events')
        .select('event_id')
      if (!cancelled) {
        setSavedIds(data ? data.map(row => row.event_id) : [])
        setLoading(false)
      }
    }
    fetchSaved()
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  function isSaved(eventId) {
    return savedIds.includes(eventId)
  }

  async function toggleSaved(eventId) {
    if (!user) return
    if (isSaved(eventId)) {
      const { error } = await supabase
        .from('saved_events')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', user.id)
      if (!error) {
        setSavedIds(prev => prev.filter(id => id !== eventId))
      }
    } else {
      const { error } = await supabase
        .from('saved_events')
        .insert({ user_id: user.id, event_id: eventId })
      if (!error) {
        setSavedIds(prev => [...prev, eventId])
      }
    }
  }

  return (
    <SavedContext.Provider value={{ savedIds, loading, isSaved, toggleSaved }}>
      {children}
    </SavedContext.Provider>
  )
}

export function useSavedContext() {
  return useContext(SavedContext)
}
