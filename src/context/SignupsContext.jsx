import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

const SignupsContext = createContext(null)

export function SignupsProvider({ children }) {
  const { user } = useAuth()
  const [signups, setSignups] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function fetchSignups() {
      if (!user) {
        setSignups([])
        setLoading(false)
        return
      }
      setLoading(true)
      const { data } = await supabase
        .from('signups')
        .select('*')
        .order('created_at', { ascending: true })
      if (!cancelled) {
        setSignups(data || [])
        setLoading(false)
      }
    }
    fetchSignups()
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  function isSignedUp(eventId) {
    return signups.some(s => s.event_id === eventId)
  }

  function getSignup(eventId) {
    return signups.find(s => s.event_id === eventId) || null
  }

  async function addSignup(eventId, note = '') {
    if (!user || isSignedUp(eventId)) return
    const { data, error } = await supabase
      .from('signups')
      .insert({ user_id: user.id, event_id: eventId, note })
      .select()
      .single()
    if (!error && data) {
      setSignups(prev => [...prev, data])
    }
  }

  async function cancelSignup(eventId) {
    if (!user) return
    const { error } = await supabase
      .from('signups')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', user.id)
    if (!error) {
      setSignups(prev => prev.filter(s => s.event_id !== eventId))
    }
  }

  async function editNote(eventId, note) {
    if (!user) return
    const { error } = await supabase
      .from('signups')
      .update({ note })
      .eq('event_id', eventId)
      .eq('user_id', user.id)
    if (!error) {
      setSignups(prev =>
        prev.map(s => s.event_id === eventId ? { ...s, note } : s)
      )
    }
  }

  function getSignupCountForEvent(eventId) {
    return signups.filter(s => s.event_id === eventId).length
  }

  return (
    <SignupsContext.Provider value={{ signups, loading, isSignedUp, getSignup, addSignup, cancelSignup, editNote, getSignupCountForEvent }}>
      {children}
    </SignupsContext.Provider>
  )
}

export function useSignupsContext() {
  return useContext(SignupsContext)
}
