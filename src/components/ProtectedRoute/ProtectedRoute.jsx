import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import { AUTH_STATE } from '../../context/authState'

export function ProtectedRoute({ children }) {
  const { authState } = useAuth()

  if (authState !== AUTH_STATE.AUTHENTICATED) {
    return <Navigate to="/login" replace />
  }

  return children
}
