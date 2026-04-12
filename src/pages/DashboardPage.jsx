import { useState } from 'react'
import { useAuth } from '../context/useAuth'
import styles from '../components/Layout.module.css'

const deleteBtnStyle = {
  color: '#f87171',
  background: 'rgba(248, 113, 113, 0.08)',
  border: '1px solid rgba(248, 113, 113, 0.2)',
  borderRadius: '6px',
  padding: '5px 12px',
  fontSize: '13px',
  cursor: 'pointer',
  fontWeight: 500,
}

const cancelBtnStyle = {
  color: 'var(--text)',
  background: 'transparent',
  border: '1px solid var(--border)',
  borderRadius: '6px',
  padding: '5px 12px',
  fontSize: '13px',
  cursor: 'pointer',
  fontWeight: 500,
}

export function DashboardPage() {
  const { currentUser, logout, profiles, removeProfile } = useAuth()
  const [confirmDelete, setConfirmDelete] = useState(null)

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
              background: 'rgba(74, 222, 128, 0.1)',
              border: '1px solid rgba(74, 222, 128, 0.2)',
              borderRadius: '20px',
              color: '#4ade80',
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
          <p style={{ color: 'var(--text)', fontSize: '18px', marginBottom: '32px' }}>
            You have successfully authenticated using your unique biometric profile.
          </p>

          <div
            style={{
              marginTop: '40px',
              padding: '24px',
              background: 'rgba(74, 222, 128, 0.05)',
              border: '1px solid rgba(74, 222, 128, 0.3)',
              borderRadius: '12px',
              textAlign: 'left',
            }}
          >
            <h2
              style={{
                color: '#4ade80',
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
            <p style={{ color: 'var(--text)', fontSize: '14px', margin: 0, lineHeight: '1.6' }}>
              Your biometric data is encrypted and stored locally in your browser's secure storage.
              No facial images are ever uploaded to a server, ensuring your privacy remains 100% intact.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: '600px', width: '100%', marginTop: '24px', textAlign: 'left' }}>
          <h2 style={{ fontSize: '15px', color: 'var(--text)', marginBottom: '12px', fontWeight: 600 }}>
            Registered Profiles ({profiles.length})
          </h2>
          {profiles.map((p) => (
            <div
              key={p.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                marginBottom: '8px',
              }}
            >
              <span style={{ color: 'var(--text-h)', fontSize: '14px', fontWeight: 500 }}>
                {p.name}{p.name === currentUser ? ' (you)' : ''}
              </span>
              {confirmDelete === p.name ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={cancelBtnStyle} onClick={() => setConfirmDelete(null)}>
                    Cancel
                  </button>
                  <button
                    style={deleteBtnStyle}
                    onClick={() => { removeProfile(p.name); setConfirmDelete(null) }}
                  >
                    Confirm delete
                  </button>
                </div>
              ) : (
                <button style={deleteBtnStyle} onClick={() => setConfirmDelete(p.name)}>
                  Delete
                </button>
              )}
            </div>
          ))}
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
