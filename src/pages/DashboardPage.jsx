import { useAuth } from '../context/useAuth'
import styles from '../components/Layout.module.css'

export function DashboardPage() {
  const { currentUser, logout } = useAuth()

  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className={styles.userBanner}>
        <span className={styles.welcomeText}>Logged in as: {currentUser}</span>
        <button className={styles.btnLogout} onClick={logout}>
          Log Out
        </button>
      </div>

      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          textAlign: 'center',
          animation: 'fadeIn 0.5s ease-out',
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '60px 40px',
            maxWidth: '600px',
            width: '100%',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              background: 'rgba(0, 255, 136, 0.1)',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              borderRadius: '20px',
              color: '#00ff88',
              fontSize: '12px',
              fontWeight: '600',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            FACE ID VERIFIED
          </div>

          <h1 style={{ fontSize: '32px', marginBottom: '16px', color: 'var(--text-h)' }}>
            Welcome, {currentUser}
          </h1>
          <p style={{ color: 'var(--text-2)', fontSize: '18px', marginBottom: '32px' }}>
            You have successfully authenticated using your unique biometric profile.
          </p>

          <div
            style={{
              marginTop: '40px',
              padding: '24px',
              background: 'rgba(0, 255, 136, 0.05)',
              border: '1px dashed #00ff88',
              borderRadius: '12px',
              textAlign: 'left',
            }}
          >
            <h2
              style={{
                color: '#00ff88',
                fontSize: '16px',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Secure Vault
            </h2>
            <p style={{ color: 'var(--text-2)', fontSize: '14px', margin: 0, lineHeight: '1.6' }}>
              Your biometric data is encrypted and stored locally in your browser's secure storage. 
              No facial images are ever uploaded to a server, ensuring your privacy remains 100% intact.
            </p>
          </div>
        </div>
        
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </main>
    </div>
  )
}
