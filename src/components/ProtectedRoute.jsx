import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default ProtectedRoute
