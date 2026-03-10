import useLocalStorage from './useLocalStorage'

function useSignups() {
  const [signups, setSignups] = useLocalStorage('volunhub_signups', [])

  function isSignedUp(eventId) {
    return signups.some(s => s.eventId === eventId)
  }

  function getSignup(eventId) {
    return signups.find(s => s.eventId === eventId) || null
  }

  function addSignup(eventId, note = '') {
    if (isSignedUp(eventId)) return
    const newSignup = {
      id: `signup-${Date.now()}`,
      eventId,
      createdAt: new Date().toISOString(),
      note
    }
    setSignups(prev => [...prev, newSignup])
  }

  function cancelSignup(eventId) {
    setSignups(prev => prev.filter(s => s.eventId !== eventId))
  }

  function editNote(eventId, note) {
    setSignups(prev =>
      prev.map(s => s.eventId === eventId ? { ...s, note } : s)
    )
  }

  function getSignupCountForEvent(eventId) {
    return signups.filter(s => s.eventId === eventId).length
  }

  return { signups, isSignedUp, getSignup, addSignup, cancelSignup, editNote, getSignupCountForEvent }
}

export default useSignups
