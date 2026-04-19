import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AuthProvider } from './context/AuthContext.jsx'
import { useAuth } from './context/useAuth'
import { AUTH_STATE } from './context/authState'
import { ModelLoader } from './components/ModelLoader'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminRoute } from './components/AdminRoute'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { DashboardPage } from './pages/DashboardPage'
import { AdminPage } from './pages/AdminPage'
import './App.css'

function RootRedirect() {
  const { authState } = useAuth()
  if (authState === AUTH_STATE.AUTHENTICATED) {
    return <Navigate to="/dashboard" replace />
  }
  return <Navigate to="/login" replace />
}

function App() {
  const { t, i18n } = useTranslation()

  useEffect(() => {
    document.title = t('pageTitle')
  }, [t, i18n.language])

  return (
    <AuthProvider>
      <ModelLoader>
        <Router>
          <a className="skip-link" href="#main-content">
            Skip to main content
          </a>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              }
            />
            <Route path="/" element={<RootRedirect />} />
            {/* Catch-all for unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ModelLoader>
    </AuthProvider>
  )
}

export default App
