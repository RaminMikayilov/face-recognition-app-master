import { locale } from 'primereact/api'
import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import azFlag from '../assets/az.png'
import gbFlag from '../assets/gb.png'
import ruFlag from '../assets/ru.png'

const languages = [
  { code: 'az', label: 'AZ', flag: azFlag },
  { code: 'en', label: 'EN', flag: gbFlag },
  { code: 'ru', label: 'RU', flag: ruFlag },
]

export default function LanguageSelector() {
  const { i18n, t } = useTranslation()
  const [activeLang, setActiveLang] = useState(() => {
    const storedLang = localStorage.getItem('language')
    return storedLang && languages.some((l) => l.code === storedLang) ? storedLang : 'az'
  })
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)
  const optionRefs = useRef([])

  useEffect(() => {
    i18n.changeLanguage(activeLang)
    localStorage.setItem('language', activeLang)
  }, [activeLang, i18n])

  const handleSelect = (lang) => {
    setActiveLang(lang)
    i18n.changeLanguage(lang)
    localStorage.setItem('language', lang)
    setOpen(false)
    locale(lang)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  useEffect(() => {
    if (open) {
      const activeIndex = languages.findIndex((l) => l.code === activeLang)
      optionRefs.current[activeIndex]?.focus()
    }
  }, [open, activeLang])

  const handleButtonKeyDown = (e) => {
    if (e.key === 'Escape') {
      setOpen(false)
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      setOpen(true)
    }
  }

  const handleOptionKeyDown = (e, langCode) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleSelect(langCode)
    } else if (e.key === 'Escape') {
      setOpen(false)
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const currentIndex = languages.findIndex((l) => l.code === langCode)
      const nextIndex = e.key === 'ArrowDown'
        ? (currentIndex + 1) % languages.length
        : (currentIndex - 1 + languages.length) % languages.length
      optionRefs.current[nextIndex]?.focus()
    }
  }

  return (
    <div style={{ position: 'relative', cursor: 'pointer' }} ref={dropdownRef}>
      <button
        aria-label={t('selectLanguage')}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        onKeyDown={handleButtonKeyDown}
        title={t('changeLanguage')}
        style={{
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          padding: '4px',
          cursor: 'pointer',
          border: '1px solid var(--border)',
          background: 'transparent',
          width: 36,
          height: 36,
          justifyContent: 'center',
        }}
      >
        <img
          style={{ width: 28, height: 26 }}
          src={languages.find((l) => l.code === activeLang)?.flag}
          alt={activeLang}
        />
      </button>
      {open && (
        <div
          role="listbox"
          aria-label={t('selectLanguage')}
          style={{
            position: 'absolute',
            right: 0,
            top: '150%',
            background: 'var(--dropdown-bg)',
            border: '1px solid var(--dropdown-border)',
            borderRadius: 6,
            minWidth: 100,
            zIndex: 100,
            boxShadow: '0 3px 6px var(--card-shadow)',
            overflow: 'hidden',
          }}
        >
          {languages.map((l, i) => {
            const isActive = l.code === activeLang

            return (
              <div
                key={l.code}
                ref={(el) => (optionRefs.current[i] = el)}
                role="option"
                aria-selected={isActive}
                tabIndex={0}
                onClick={() => handleSelect(l.code)}
                onKeyDown={(e) => handleOptionKeyDown(e, l.code)}
                style={{
                  padding: '6px 12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  backgroundColor: isActive ? 'var(--success-bg)' : 'var(--dropdown-bg)',
                  fontWeight: isActive ? '600' : '400',
                  color: 'var(--text-h)',
                  borderLeft: isActive ? '4px solid var(--success)' : '4px solid transparent',
                  transition: 'all 0.2s',
                }}
              >
                <img style={{ width: 28, height: 26 }} src={l.flag} alt={l.label} />
                {l.label}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
