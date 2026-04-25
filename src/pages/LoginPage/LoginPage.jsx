import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import { LoginFace } from '../../components/LoginFace'
import styles from '../../components/Layout.module.css'
import { useTranslation } from 'react-i18next'
import ThemeToggle from '../../components/ThemeToggle'
import LanguageSelector from '../../components/LanguageSelector'

export function LoginPage() {
  const { matcher, login } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleLogin = (name) => {
    login(name)
    navigate('/dashboard')
  }

  return (
    <main id="main-content" className={styles.container}>
      <div className={styles.authTopBar}>
        <div className={styles.bannerActions}>
          <ThemeToggle />
          <LanguageSelector />
        </div>
      </div>

      <header className={styles.appHeader}>
        <h1>{t('faceRecognition')}</h1>
        <p>{t('authenticateWithFace')}</p>
      </header>

      <LoginFace matcher={matcher} onLogin={handleLogin} />

      <nav style={{ marginTop: '20px', textAlign: 'center' }}>
        <p>
          {t('dontHaveProfile')} <Link to="/register">{t('registerHere')}</Link>
        </p>
      </nav>
    </main>
  )
}
