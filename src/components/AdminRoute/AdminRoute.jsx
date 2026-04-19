import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import { AUTH_STATE } from '../../context/authState'

export function AdminRoute({ children }) {
  const { authState, currentRole } = useAuth()

  if (authState !== AUTH_STATE.AUTHENTICATED) {
    return <Navigate to="/login" replace />
  }

  if (currentRole !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
