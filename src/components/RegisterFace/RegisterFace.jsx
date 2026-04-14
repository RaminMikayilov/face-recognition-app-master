import { useState } from 'react'
import * as faceapi from 'face-api.js'
import { useCamera, CAMERA_STATUS } from '../../hooks/useCamera'
import { DETECTION_OPTIONS, FACE_MATCH_THRESHOLD } from '../../constants/config'
import styles from './RegisterFace.module.css'
import { isNameTaken, getMatchingProfile } from '../../utils/faceAuthStorage'
import LanguageSelector from '../LanguageSelector'
import { useTranslation } from 'react-i18next'

export function RegisterFace({ onRegister }) {
  const {t} = useTranslation();
  const { videoRef, status: cameraStatus, startCamera, stopCamera } = useCamera()
  const [name, setName] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [capturing, setCapturing] = useState(false)

  const isCameraOn = cameraStatus === CAMERA_STATUS.ACTIVE

  async function handleSaveFace() {
    const video = videoRef.current
    if (!video || video.readyState < 2) {
      setFeedback({ type: 'error', message: t("cameraNotReady")})
      return
    }

    setCapturing(true)
    setFeedback(null)

    try {
      const result = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions(DETECTION_OPTIONS))
        .withFaceLandmarks(true)
        .withFaceDescriptor()

      if (!result) {
        setFeedback({
          type: 'error',
          message: t("noFaceDetected"),
        })
        return
      }

      const existingName = getMatchingProfile(result.descriptor, FACE_MATCH_THRESHOLD)
      if (existingName) {
        setFeedback({
          type: 'error',
          message: t("faceAlreadyRegistered", { name: existingName }),
        })
        return
      }

      setFeedback({ type: 'success', message: t("faceSaved", { name: name.trim() }) })
      stopCamera()
      setTimeout(() => onRegister(name.trim(), result.descriptor), 800)
    } catch (err) {
      setFeedback({ type: 'error',message: t("detectionFailed", { error: err.message }),})
    } finally {
      setCapturing(false)
    }
  }

  const canSave = isCameraOn && name.trim().length > 0 && !capturing
  const canOpenCamera = !isCameraOn && name.trim().length > 0

  function handleOpenCamera() {
    if (isNameTaken(name.trim())) {
      setFeedback({
        type: 'error',
        message: t("nameAlreadyRegistered"),
      })
      return
    }
    setFeedback(null)
    startCamera()
  }

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{t("registerYourFace")}</h2>
      <p className={styles.subtitle}>{t("enterYourNameOpenCamera")}</p>

      <div className={styles.form}>
        <input
          className={styles.input}
          type="text"
          placeholder={t("yourName")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={40}
          autoFocus
        />
      </div>

      <div className={`${styles.videoWrapper} ${capturing ? styles.capturing : ''}`}>
        <video ref={videoRef} className={styles.video} autoPlay muted playsInline />
        
        {isCameraOn && (
          <div className={`${styles.faceGuide} ${capturing ? styles.capturing : styles.active}`}>
            <div className={styles.scanLine} />
          </div>
        )}

        {!isCameraOn && (
          <div className={styles.placeholder}>
            <svg
              className={styles.placeholderIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>{t("cameraOff")}</span>
          </div>
        )}
      </div>

      {feedback && (
        <div className={feedback.type === 'error' ? styles.error : styles.success}>
          {feedback.message}
        </div>
      )}

      <div className={styles.actions}>
        {!isCameraOn ? (
          <button className={styles.btnPrimary} onClick={handleOpenCamera} disabled={!canOpenCamera}>
            {t("openCamera")}
          </button>
            
        ) : (
          <>
            <button className={styles.btnSecondary} onClick={stopCamera}>
              {t("cancel")}
            </button>
            <button className={styles.btnPrimary} onClick={handleSaveFace} disabled={!canSave}>
              {capturing ? t('saving') : t('saveFace')}
            </button>
          </>
        )}
        <LanguageSelector />
      </div>
    </div>
  )
}
