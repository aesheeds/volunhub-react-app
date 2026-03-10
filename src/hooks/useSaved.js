import useLocalStorage from './useLocalStorage'

function useSaved() {
  const [savedIds, setSavedIds] = useLocalStorage('volunhub_saved', [])

  function isSaved(eventId) {
    return savedIds.includes(eventId)
  }

  function toggleSaved(eventId) {
    setSavedIds(prev =>
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    )
  }

  return { savedIds, isSaved, toggleSaved }
}

export default useSaved
