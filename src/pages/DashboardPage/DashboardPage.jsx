import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import { isNameTaken } from '../../utils/profileStorage'
import styles from '../../components/Layout.module.css'
import pageStyles from './DashboardPage.module.css'
import { useTranslation } from 'react-i18next'
import LanguageSelector from '../../components/LanguageSelector'
import ThemeToggle from '../../components/ThemeToggle'

export function DashboardPage() {
  const { currentUser, currentRole, logout, profiles, removeProfile, renameProfile } = useAuth()
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [editingName, setEditingName] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [editError, setEditError] = useState('')
  const { t } = useTranslation()

  const startEdit = (name) => {
    setEditingName(name)
    setEditValue(name)
    setEditError('')
    setConfirmDelete(null)
  }

  const cancelEdit = () => {
    setEditingName(null)
    setEditValue('')
    setEditError('')
  }

  const saveEdit = async (oldName) => {
    const newName = editValue.trim()
    if (!newName) return setEditError(t('nameRequired'))
    if (newName === oldName) return cancelEdit()
    if (await isNameTaken(newName)) return setEditError(t('nameTaken'))
    await renameProfile(oldName, newName)
    cancelEdit()
  }

  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className={styles.userBanner}>
        <span className={styles.welcomeText}>
          <span className={styles.welcomeLabel}>{t('loggedInAs')} </span>
          <span className={styles.welcomeName}>{currentUser}</span>
        </span>
        {currentRole === 'admin' && (
          <Link to="/admin" className={styles.btnAdmin}>
            {t('adminPanel')}
          </Link>
        )}
        <button className={styles.btnLogout} onClick={logout}>
          {t('logOut')}
        </button>
        <div className={styles.bannerActions}>
          <ThemeToggle />
          <LanguageSelector />
        </div>
      </header>

      <main id="main-content" tabIndex={-1} className={pageStyles.main}>
        <div className={pageStyles.card}>
          <div
            className={pageStyles.verifiedBadge}
            style={{
              background: 'var(--success-bg)',
              border: '1px solid var(--success-border)',
              color: 'var(--success)',
            }}
          >
            <svg
              aria-hidden="true"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
            {t('faceIdVerified')}
          </div>

          <h1 className={pageStyles.cardTitle} style={{ color: 'var(--text-h)' }}>
            {t('welcomeUser')}, {currentUser}
          </h1>
          <p className={pageStyles.cardSubtitle} style={{ color: 'var(--text)' }}>
            {t('authSuccessMessage')}
          </p>

          <div
            className={pageStyles.secureVault}
            style={{
              background: 'var(--success-bg)',
              border: '1px solid var(--success-border)',
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
              <svg
                aria-hidden="true"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              {t('secureVault')}
            </h2>
            <p style={{ color: 'var(--text)', fontSize: '14px', margin: 0, lineHeight: '1.6' }}>
              {t('biometricSecurityInfo')}
            </p>
          </div>
        </div>

        <div className={pageStyles.profileSection}>
          <h2
            style={{ fontSize: '15px', color: 'var(--text)', marginBottom: '2px', fontWeight: 600 }}
          >
            {t('yourProfile')}
          </h2>

          <ul
            aria-label={t('profileListLabel')}
            style={{ listStyle: 'none', padding: 0, margin: 0 }}
          >
            {profiles
              .filter((p) => p.name === currentUser)
              .map((p) => (
                <li key={p.name} className={pageStyles.listItem}>
                  {editingName === p.name ? (
                    <div className={pageStyles.editContainer}>
                      <div className={pageStyles.editRow}>
                        <input
                          autoFocus
                          value={editValue}
                          maxLength={40}
                          onChange={(e) => {
                            setEditValue(e.target.value)
                            setEditError('')
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEdit(p.name)
                            if (e.key === 'Escape') cancelEdit()
                          }}
                          style={{
                            flex: 1,
                            padding: '5px 10px',
                            fontSize: '14px',
                            borderRadius: '6px',
                            border: `1px solid ${editError ? 'var(--danger)' : 'var(--accent)'}`,
                            background: 'var(--bg)',
                            color: 'var(--text-h)',
                            outline: 'none',
                          }}
                        />
                        <button
                          onClick={() => saveEdit(p.name)}
                          style={{
                            padding: '5px 12px',
                            fontSize: '13px',
                            fontWeight: 600,
                            borderRadius: '6px',
                            border: '1px solid var(--accent)',
                            background: 'var(--accent)',
                            color: '#fff',
                            cursor: 'pointer',
                          }}
                        >
                          {t('saveChanges')}
                        </button>
                        <button
                          onClick={cancelEdit}
                          style={{
                            padding: '5px 12px',
                            fontSize: '13px',
                            fontWeight: 500,
                            borderRadius: '6px',
                            border: '1px solid var(--border)',
                            background: 'transparent',
                            color: 'var(--text)',
                            cursor: 'pointer',
                          }}
                        >
                          {t('cancel')}
                        </button>
                      </div>
                      {editError && (
                        <span style={{ fontSize: '12px', color: 'var(--danger)' }}>
                          {editError}
                        </span>
                      )}
                    </div>
                  ) : (
                    <>
                      <span
                        style={{
                          color: 'var(--text-h)',
                          fontSize: '14px',
                          fontWeight: 500,
                          flex: 1,
                        }}
                      >
                        {p.name}
                      </span>
                      {confirmDelete === p.name ? (
                        <div className={pageStyles.listItemActions}>
                          <button
                            aria-label={t('cancelDeleteLabel', { name: p.name })}
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
                            {t('cancel')}
                          </button>
                          <button
                            aria-label={t('confirmDeleteLabel', { name: p.name })}
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
                            onClick={() => {
                              removeProfile(p.name)
                              setConfirmDelete(null)
                            }}
                          >
                            {t('confirmDelete')}
                          </button>
                        </div>
                      ) : (
                        <div className={pageStyles.listItemActions}>
                          <button
                            aria-label={t('editProfile')}
                            style={{
                              color: 'var(--accent)',
                              background: 'var(--accent-bg)',
                              border: '1px solid var(--accent)',
                              borderRadius: '6px',
                              padding: '5px 12px',
                              fontSize: '13px',
                              cursor: 'pointer',
                              fontWeight: 500,
                            }}
                            onClick={() => startEdit(p.name)}
                          >
                            {t('editProfile')}
                          </button>
                          <button
                            aria-label={t('deleteProfileLabel', { name: p.name })}
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
                            {t('delete')}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </li>
              ))}
          </ul>
        </div>
      </main>
    </div>
  )
}
