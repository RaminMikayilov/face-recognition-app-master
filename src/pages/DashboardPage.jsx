import { useState } from 'react'
import { useAuth } from '../context/useAuth'
import styles from '../components/Layout.module.css'
import { useTranslation } from 'react-i18next'
import LanguageSelector from '../components/LanguageSelector';
import ThemeToggle from '../components/ThemeToggle';

export function DashboardPage() {
  const { currentUser, logout, profiles, removeProfile } = useAuth()
  const [confirmDelete, setConfirmDelete] = useState(null)
  const {t} = useTranslation();

  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className={styles.userBanner}>
        <span className={styles.welcomeText}>{t("loggedInAs")} {currentUser}</span>
        <div className={styles.actions}>
          <ThemeToggle />
          <LanguageSelector />
        </div>
        <button className={styles.btnLogout} onClick={logout}>
          {t("logOut")}
        </button>
      </header>

      <main
        id="main-content"
        tabIndex={-1}
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
            background: 'var(--card-bg)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '60px 40px',
            maxWidth: '600px',
            width: '100%',
            boxShadow: `0 10px 30px var(--card-shadow)`,
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
              background: 'var(--success-bg)',
              border: '1px solid var(--success-border)',
              borderRadius: '20px',
              color: 'var(--success)',
              fontSize: '12px',
              fontWeight: '600',
            }}
          >
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            {t("faceIdVerified")}
          </div>

          <h1 style={{ fontSize: '32px', marginBottom: '16px', color: 'var(--text-h)' }}>
            {t("welcomeUser")}, {currentUser}
          </h1>
          <p style={{ color: 'var(--text)', fontSize: '18px', marginBottom: '32px' }}>
            {t("authSuccessMessage")}
          </p>

          <div
            style={{
              marginTop: '40px',
              padding: '24px',
              background: 'var(--success-bg)',
              border: '1px solid var(--success-border)',
              borderRadius: '12px',
              textAlign: 'left',
            }}
          >
            <h2
              style={{
                color: 'var(--success)',
                fontSize: '16px',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              {t("secureVault")}
            </h2>
            <p style={{ color: 'var(--text)', fontSize: '14px', margin: 0, lineHeight: '1.6' }}>
              {t("biometricSecurityInfo")}
            </p>
          </div>
        </div>

        <div style={{ maxWidth: '600px', width: '100%', marginTop: '24px', textAlign: 'left' }}>
          <h2 style={{ fontSize: '15px', color: 'var(--text)', marginBottom: '2px', fontWeight: 600 }}>
            {t("yourProfile")}
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text)', opacity: 0.6, marginBottom: '10px', margin: '0 0 10px' }}>
            {t("totalProfilesInfo", { count: profiles.length })}
          </p>
          <ul aria-label={t("profileListLabel")} style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {profiles.filter(p => p.name === currentUser).map((p) => (
              <li
                key={p.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  marginBottom: '8px',
                }}
              >
                <span style={{ color: 'var(--text-h)', fontSize: '14px', fontWeight: 500 }}>
                  {p.name}
                </span>
                {confirmDelete === p.name ? (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      aria-label={t("cancelDeleteLabel", { name: p.name })}
                      style={{
                        color: 'var(--text)',
                        background: 'transparent',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        padding: '5px 12px',
                        fontSize: '13px',
                        cursor: 'pointer',
                        fontWeight: 500,
                      }}
                      onClick={() => setConfirmDelete(null)}
                    >
                      {t("cancel")}
                    </button>
                    <button
                      aria-label={t("confirmDeleteLabel", { name: p.name })}
                      style={{
                        color: 'var(--danger)',
                        background: 'var(--danger-bg)',
                        border: '1px solid var(--danger-border)',
                        borderRadius: '6px',
                        padding: '5px 12px',
                        fontSize: '13px',
                        cursor: 'pointer',
                        fontWeight: 500,
                      }}
                      onClick={() => { removeProfile(p.name); setConfirmDelete(null) }}
                    >
                      {t("confirmDelete")}
                    </button>
                  </div>
                ) : (
                  <button
                    aria-label={t("deleteProfileLabel", { name: p.name })}
                    style={{
                      color: 'var(--danger)',
                      background: 'var(--danger-bg)',
                      border: '1px solid var(--danger-border)',
                      borderRadius: '6px',
                      padding: '5px 12px',
                      fontSize: '13px',
                      cursor: 'pointer',
                      fontWeight: 500,
                    }}
                    onClick={() => setConfirmDelete(p.name)}
                  >
                    {t("delete")}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  )
}
