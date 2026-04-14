import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { RegisterFace } from '../components/RegisterFace'
import styles from '../components/Layout.module.css'
import { useTranslation } from 'react-i18next'

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const {t} = useTranslation();

  const handleRegister = (name, descriptor) => {
    register(name, descriptor)
    navigate('/dashboard')
  }

  return (
    <div className={styles.container}>
      <div className={styles.appHeader}>
        <h1>{t("faceRecognition")}</h1>
        <p>{t("authenticateWithFace")}</p>
      </div>

      <RegisterFace onRegister={handleRegister} />

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p>
          {t("dontHaveProfile")} <Link to="/login">{t("loginHere")}</Link>
        </p>
      </div>
    </div>
  )
}
