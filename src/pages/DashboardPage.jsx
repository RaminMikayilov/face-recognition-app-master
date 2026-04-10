import { useAuth } from '../context/AuthContext';
import styles from '../components/Layout.module.css';

export function DashboardPage() {
  const { currentUser, logout } = useAuth();

  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className={styles.userBanner}>
        <span className={styles.welcomeText}>Logged in as: {currentUser}</span>
        <button className={styles.btnLogout} onClick={logout}>
          Log Out
        </button>
      </div>

      <main style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '40px',
        textAlign: 'center'
      }}>
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.03)', 
          border: '1px solid var(--border)', 
          borderRadius: '16px',
          padding: '60px 40px',
          maxWidth: '600px',
          width: '100%',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <h1 style={{ fontSize: '32px', marginBottom: '16px', color: 'var(--text-h)' }}>
            Welcome to something
          </h1>
          <p style={{ color: 'var(--text-2)', fontSize: '18px', marginBottom: '32px' }}>
            Hello, <strong>{currentUser}</strong>! You have successfully authenticated using your face.
          </p>
          
          <div style={{ 
            marginTop: '40px', 
            padding: '24px', 
            background: 'rgba(0, 255, 136, 0.05)', 
            border: '1px dashed #00ff88', 
            borderRadius: '12px' 
          }}>
            <h2 style={{ color: '#00ff88', fontSize: '16px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              🔒 Protected Content Area
            </h2>
            <p style={{ color: 'var(--text-2)', fontSize: '14px', margin: 0 }}>
              This information is only visible to users who have completed the face recognition scan. 
              Your biometric profile is stored locally and used for secure access.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
