import { useState } from 'react'
import * as faceapi from 'face-api.js'
import { useCamera, CAMERA_STATUS } from '../../hooks/useCamera'
import { DETECTION_OPTIONS } from '../../constants/config'
import styles from './RegisterFace.module.css'
import { isNameTaken } from '../../utils/faceAuthStorage'

export function RegisterFace({ onRegister }) {
  const { videoRef, status: cameraStatus, startCamera, stopCamera } = useCamera()
  const [name, setName] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [capturing, setCapturing] = useState(false)

  const isCameraOn = cameraStatus === CAMERA_STATUS.ACTIVE

  async function handleSaveFace() {
    const video = videoRef.current
    if (!video || video.readyState < 2) {
      setFeedback({ type: 'error', message: 'Camera not ready. Please wait.' })
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
          message: 'No face detected. Center your face in the frame and try again.',
        })
        return
      }

      setFeedback({ type: 'success', message: `Face saved for "${name}"! Logging you in...` })
      stopCamera()
      setTimeout(() => onRegister(name.trim(), result.descriptor), 800)
    } catch (err) {
      setFeedback({ type: 'error', message: `Detection failed: ${err.message}` })
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
        message: 'This name is already registered. Please use a different name.',
      })
      return
    }
    setFeedback(null)
    startCamera()
  }

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Register Your Face</h2>
      <p className={styles.subtitle}>Enter your name, open the camera, then click Save Face.</p>

      <div className={styles.form}>
        <input
          className={styles.input}
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={40}
          autoFocus
        />
      </div>

      <div className={styles.videoWrapper}>
        <video ref={videoRef} className={styles.video} autoPlay muted playsInline />
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
            <span>Camera off</span>
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
            Open Camera
          </button>
        ) : (
          <>
            <button className={styles.btnSecondary} onClick={stopCamera}>
              Cancel
            </button>
            <button className={styles.btnPrimary} onClick={handleSaveFace} disabled={!canSave}>
              {capturing ? 'Saving...' : 'Save Face'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
