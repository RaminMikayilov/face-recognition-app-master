import { useEffect, useRef, useState, useCallback } from 'react';
import * as faceapi from 'face-api.js';
import { useCamera, CAMERA_STATUS } from '../hooks/useCamera';
import { DETECTION_OPTIONS } from '../constants/config';
import styles from './LoginFace.module.css';

const STATUS = {
  IDLE: 'idle',
  LOOKING: 'looking',
  VERIFYING: 'verifying',
  SUCCESS: 'success',
  FAILED: 'failed',
};

export function LoginFace({ matcher, onLogin }) {
  const { videoRef, status: cameraStatus, startCamera } = useCamera();
  const [matchStatus, setMatchStatus] = useState(STATUS.IDLE);
  const [retryCount, setRetryCount] = useState(0);
  const rafRef = useRef(null);
  const lockedRef = useRef(false);
  const faceSeenAtRef = useRef(null);

  const isCameraOn = cameraStatus === CAMERA_STATUS.ACTIVE;

  // Auto-start camera on mount
  useEffect(() => {
    startCamera();
  }, [startCamera]);

  // Detection loop — re-runs on retry
  useEffect(() => {
    if (!isCameraOn || !matcher) return;

    lockedRef.current = false;
    faceSeenAtRef.current = null;
    setMatchStatus(STATUS.LOOKING);

    async function runFrame() {
      if (lockedRef.current) return;

      const video = videoRef.current;
      if (!video || video.readyState < 2) {
        rafRef.current = requestAnimationFrame(runFrame);
        return;
      }

      try {
        const result = await faceapi
          .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions(DETECTION_OPTIONS))
          .withFaceLandmarks(true)
          .withFaceDescriptor();

        if (lockedRef.current) return;

        if (result) {
          setMatchStatus(STATUS.VERIFYING);
          if (!faceSeenAtRef.current) faceSeenAtRef.current = Date.now();

          const match = matcher.findBestMatch(result.descriptor);

          if (match.label !== 'unknown') {
            lockedRef.current = true;
            setMatchStatus(STATUS.SUCCESS);
            setTimeout(() => onLogin(match.label), 900);
            return;
          }

          if (Date.now() - faceSeenAtRef.current > 5000) {
            lockedRef.current = true;
            setMatchStatus(STATUS.FAILED);
            return;
          }
        } else {
          faceSeenAtRef.current = null;
          if (!lockedRef.current) setMatchStatus(STATUS.LOOKING);
        }
      } catch {
        // Frame torn down — skip
      }

      rafRef.current = requestAnimationFrame(runFrame);
    }

    rafRef.current = requestAnimationFrame(runFrame);

    return () => {
      lockedRef.current = true;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isCameraOn, matcher, videoRef, onLogin, retryCount]);

  const handleRetry = useCallback(() => {
    setRetryCount((n) => n + 1);
  }, []);

  const overlayLabel = {
    [STATUS.IDLE]: null,
    [STATUS.LOOKING]: { text: 'Looking for face...', cls: styles.statusLooking },
    [STATUS.VERIFYING]: { text: 'Verifying...', cls: styles.statusVerifying },
    [STATUS.SUCCESS]: { text: 'Face recognized!', cls: styles.statusSuccess },
    [STATUS.FAILED]: { text: 'Face not recognized', cls: styles.statusFailed },
  }[matchStatus];

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Welcome Back</h2>
      <p className={styles.subtitle}>Look at the camera to log in automatically.</p>

      <div className={styles.videoWrapper}>
        <video
          ref={videoRef}
          className={styles.video}
          autoPlay
          muted
          playsInline
        />
        {overlayLabel && (
          <div className={`${styles.statusOverlay} ${overlayLabel.cls}`}>
            {overlayLabel.text}
          </div>
        )}
      </div>

      {matchStatus === STATUS.FAILED && (
        <div className={styles.actions}>
          <button className={styles.btnPrimary} onClick={handleRetry}>
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
