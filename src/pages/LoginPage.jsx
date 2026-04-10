import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { LoginFace } from '../components/LoginFace'
import styles from '../components/Layout.module.css'

export function LoginPage() {
  const { matcher, login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = (name) => {
    login(name)
    navigate('/dashboard')
  }

  return (
    <div className={styles.container}>
      <div className={styles.appHeader}>
        <h1>Face Recognition</h1>
        <p>Authenticate with your face to continue</p>
      </div>

      <LoginFace matcher={matcher} onLogin={handleLogin} />

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p>
          Don't have a profile? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  )
}
