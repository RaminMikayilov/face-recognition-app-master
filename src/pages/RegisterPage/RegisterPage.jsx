import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import { RegisterFace } from '../../components/RegisterFace'
import styles from '../../components/Layout.module.css'
import { useTranslation } from 'react-i18next'
import ThemeToggle from '../../components/ThemeToggle'
import LanguageSelector from '../../components/LanguageSelector'

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleRegister = async (name, descriptor) => {
    await register(name, descriptor)
    navigate('/dashboard')
  }

  return (
    <main id="main-content" className={styles.container}>
      <header className={styles.appHeader}>
        <h1>{t('faceRecognition')}</h1>
        <p>{t('authenticateWithFace')}</p>
        <div className={styles.actions}>
          <ThemeToggle />
          <LanguageSelector />
        </div>
      </header>

      <RegisterFace onRegister={handleRegister} />

      <nav style={{ marginTop: '20px', textAlign: 'center' }}>
        <p>
          {t('alreadyHaveAccount')} <Link to="/login">{t('loginHere')}</Link>
        </p>
      </nav>
    </main>
  )
}
