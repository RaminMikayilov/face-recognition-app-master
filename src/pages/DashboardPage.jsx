import { useAuth } from '../context/AuthContext';
import { FaceRecognitionApp } from '../components/FaceRecognitionApp';
import styles from '../components/Layout.module.css';

export function DashboardPage() {
  const { currentUser, logout, matcher } = useAuth();

  return (
    <div style={{ width: '100%' }}>
      <div className={styles.userBanner}>
        <span className={styles.welcomeText}>Welcome, {currentUser}!</span>
        <button className={styles.btnLogout} onClick={logout}>
          Log Out
        </button>
      </div>
      <FaceRecognitionApp matcher={matcher} />
    </div>
  );
}
