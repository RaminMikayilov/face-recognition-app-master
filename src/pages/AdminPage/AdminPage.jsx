import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import styles from '../../components/Layout.module.css'
import pageStyles from './AdminPage.module.css'
import { useTranslation } from 'react-i18next'
import ThemeToggle from '../../components/ThemeToggle'
import LanguageSelector from '../../components/LanguageSelector'

export function AdminPage() {
  const { currentUser, currentRole, logout, profiles, removeProfile } = useAuth()
  const [confirmDelete, setConfirmDelete] = useState(null)
  const { t } = useTranslation()

  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className={styles.userBanner}>
        <span className={styles.welcomeText}>{t("loggedInAs")} {currentUser}</span>
        <div className={styles.bannerActions}>
          <ThemeToggle />
          <LanguageSelector />
        </div>
        <Link to="/dashboard" className={styles.btnAdmin}>
          {t("dashboard")}
        </Link>
        <button className={styles.btnLogout} onClick={logout}>
          {t("logOut")}
        </button>
      </header>

      <main
        id="main-content"
        tabIndex={-1}
        className={pageStyles.main}
      >
        <div className={pageStyles.content}>
          <h1 style={{ fontSize: '22px', color: 'var(--text-h)', marginBottom: '4px', fontWeight: 700 }}>
            {t("adminPanel")}
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text)', opacity: 0.6, marginBottom: '24px' }}>
            {t("totalProfilesInfo", { count: profiles.length })}
          </p>

          <ul aria-label={t("allProfiles")} style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {profiles.map((p) => (
              <li
                key={p.name}
                className={pageStyles.listItem}
              >
                <div className={pageStyles.listItemInfo}>
                  <span style={{ color: 'var(--text-h)', fontSize: '14px', fontWeight: 500 }}>
                    {p.name}{p.name === currentUser ? ` (${t("you")})` : ''}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '12px',
                      background: p.role === 'admin' ? 'var(--accent-bg)' : 'var(--success-bg)',
                      color: p.role === 'admin' ? 'var(--accent)' : 'var(--success)',
                      border: `1px solid ${p.role === 'admin' ? 'var(--accent)' : 'var(--success-border)'}`,
                    }}
                  >
                    {t(p.role ?? 'user')}
                  </span>
                </div>

                {confirmDelete === p.name ? (
                  <div className={pageStyles.listItemActions}>
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
                  <div className={pageStyles.listItemActions}>
                    <button
                      aria-label={t("deleteProfileLabel", { name: p.name })}
                      disabled={p.name === currentUser}
                      style={{
                        color: p.name === currentUser ? 'var(--text-2)' : 'var(--danger)',
                        background: p.name === currentUser ? 'transparent' : 'var(--danger-bg)',
                        border: `1px solid ${p.name === currentUser ? 'var(--border)' : 'var(--danger-border)'}`,
                        borderRadius: '6px',
                        padding: '5px 12px',
                        fontSize: '13px',
                        cursor: p.name === currentUser ? 'not-allowed' : 'pointer',
                        fontWeight: 500,
                        opacity: p.name === currentUser ? 0.5 : 1,
                      }}
                      onClick={() => setConfirmDelete(p.name)}
                    >
                      {t("delete")}
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  )
}
