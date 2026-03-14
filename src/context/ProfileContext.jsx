import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

const ProfileContext = createContext(null)

export function ProfileProvider({ children }) {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    setLoading(true)

    async function fetchProfile() {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(data ? {
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        causes: data.preferred_causes || [],
        locations: data.preferred_locations || [],
        types: data.preferred_types || [],
      } : { firstName: '', lastName: '', causes: [], locations: [], types: [] })

      setLoading(false)
    }

    fetchProfile()
  }, [user?.id])

  async function updateProfile(updates) {
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      email: user.email,
      first_name: updates.firstName.trim(),
      last_name: updates.lastName.trim(),
      preferred_causes: updates.causes,
      preferred_locations: updates.locations,
      preferred_types: updates.types,
    })
    if (!error) {
      setProfile({ ...updates, firstName: updates.firstName.trim(), lastName: updates.lastName.trim() })
    }
    return { error }
  }

  function resetProfile() {
    setProfile({ firstName: '', lastName: '', causes: [], locations: [], types: [] })
  }

  return (
    <ProfileContext.Provider value={{ profile, loading, updateProfile, resetProfile }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfileContext() {
  return useContext(ProfileContext)
}
