import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { AuthProvider } from './context/AuthContext.jsx'
import { ModelLoader } from './components/ModelLoader'
import { AppRoutes } from './routes/AppRoutes'
import './App.css'

function App() {
  const { t, i18n } = useTranslation()

  useEffect(() => {
    document.title = t('pageTitle')
  }, [t, i18n.language])

  return (
    <AuthProvider>
      <ModelLoader>
        <AppRoutes />
      </ModelLoader>
    </AuthProvider>
  )
}

export default App
