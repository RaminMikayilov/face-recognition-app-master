import { locale } from 'primereact/api'
import { Button } from 'primereact/button'
import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import azFlag from '../assets/az.png'
import gbFlag from '../assets/gb.png'


const languages = [
  { code: 'az', label: 'AZ', flag: azFlag },
  { code: 'en', label: 'EN', flag: gbFlag },
]

export default function LanguageSelector() {
  const { i18n, t } = useTranslation()
  const [activeLang, setActiveLang] = useState(() => {
    const storedLang = localStorage.getItem('language')
    return storedLang && languages.some((l) => l.code === storedLang) ? storedLang : 'az'
  })
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)

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

  return (
    <div style={{ position: 'relative', cursor: 'pointer' }} ref={dropdownRef}>
      <Button
        tooltip={t('changeLanguage')}
        tooltipOptions={{
          position: 'top',
        }}
        rounded
        severity="success"
        text
        className="hover-green-effekt"
        onClick={() => setOpen(!open)}
        style={{
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          padding: '4px',
          cursor: 'pointer',
        }}
      >
        <img
          style={{ width: 30, height: 28 }}
          src={languages.find((l) => l.code === activeLang)?.flag}
          alt={activeLang}
        />
      </Button>
      {open && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            bottom: '150%',
            background: '#fff',
            border: '1px solid #ddd',
            borderRadius: 6,
            minWidth: 100,
            zIndex: 100,
            boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
            overflow: 'hidden',
          }}
        >
          {languages.map((l) => {
            const isActive = l.code === activeLang

            return (
              <div
                key={l.code}
                onClick={() => handleSelect(l.code)}
                style={{
                  padding: '6px 12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  backgroundColor: isActive ? '#d0f0e0' : '#fff',
                  fontWeight: isActive ? '600' : '400',
                  borderLeft: isActive ? '4px solid #339967' : '4px solid transparent',
                  transition: 'all 0.2s',
                }}
              >
                <img style={{ width: 30, height: 28 }} src={l.flag} alt={l.label} />
                {l.label}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
