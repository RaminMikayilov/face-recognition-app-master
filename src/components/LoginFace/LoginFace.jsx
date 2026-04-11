import { useEffect, useRef, useState, useCallback } from 'react';
import * as faceapi from 'face-api.js';
import { useCamera, CAMERA_STATUS } from '../../hooks/useCamera';
import { DETECTION_OPTIONS } from '../../constants/config';
import styles from './LoginFace.module.css';

const STATUS = {
  IDLE: 'idle',
  LOOKING: 'looking',
  VERIFYING: 'verifying',
  SUCCESS: 'success',
  FAILED: 'failed',
};

export function LoginFace({ matcher, onLogin }) {
  const { videoRef, status: cameraStatus, startCamera, stopCamera } = useCamera();
  const [scanning, setScanning] = useState(false);
  const [matchStatus, setMatchStatus] = useState(STATUS.IDLE);
  const [retryCount, setRetryCount] = useState(0);
  const rafRef = useRef(null);
  const lockedRef = useRef(false);
  const faceSeenAtRef = useRef(null);

  const isCameraOn = cameraStatus === CAMERA_STATUS.ACTIVE;

  const handleStartScan = useCallback(() => {
    setScanning(true);
    setMatchStatus(STATUS.IDLE);
    startCamera();
  }, [startCamera]);

  const handleCancel = useCallback(() => {
    lockedRef.current = true;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    stopCamera();
    setScanning(false);
    setMatchStatus(STATUS.IDLE);
    setRetryCount(0);
  }, [stopCamera]);

  // Detection loop — only runs when scanning is active
  useEffect(() => {
    if (!scanning || !isCameraOn || !matcher) return;

    lockedRef.current = false;
    faceSeenAtRef.current = null;
    let statusInitialized = false;

    async function runFrame() {
      if (lockedRef.current) return;

      if (!statusInitialized) {
        statusInitialized = true;
        setMatchStatus(STATUS.LOOKING);
      }

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
  }, [scanning, isCameraOn, matcher, videoRef, onLogin, retryCount]);

  const handleRetry = useCallback(() => {
    setRetryCount((n) => n + 1);
  }, []);

  const overlayLabel = {
    [STATUS.IDLE]: null,
    [STATUS.LOOKING]: { text: 'Align face within guide...', cls: styles.statusLooking, guideCls: styles.looking },
    [STATUS.VERIFYING]: { text: 'Scanning...', cls: styles.statusVerifying, guideCls: styles.verifying },
    [STATUS.SUCCESS]: { text: 'Welcome back!', cls: styles.statusSuccess, guideCls: styles.success },
    [STATUS.FAILED]: { text: 'Could not verify face', cls: styles.statusFailed, guideCls: styles.failed },
  }[matchStatus];

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Welcome Back</h2>
      <p className={styles.subtitle}>
        {scanning ? 'Look at the camera to log in.' : 'Click the button below to start face scan.'}
      </p>

      <div className={`${styles.videoWrapper} ${scanning ? styles.scanning : ''}`}>
        <video ref={videoRef} className={styles.video} autoPlay muted playsInline />

        {scanning && (
          <div className={`${styles.faceGuide} ${overlayLabel?.guideCls || ''}`}>
            <div className={styles.scanLine} />
          </div>
        )}

        {!scanning && (
          <div className={styles.placeholder}>
            <svg className={styles.placeholderIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 7l-7 5 7 5V7z" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
            <span>Camera is off</span>
          </div>
        )}

        {scanning && overlayLabel && (
          <div className={`${styles.statusOverlay} ${overlayLabel.cls}`}>
            {overlayLabel.text}
          </div>
        )}
      </div>

      <div className={styles.actions}>
        {!scanning && (
          <button className={styles.btnPrimary} onClick={handleStartScan} disabled={!matcher}>
            Login with Face
          </button>
        )}

        {scanning && matchStatus === STATUS.FAILED && (
          <>
            <button className={styles.btnSecondary} onClick={handleCancel}>
              Cancel
            </button>
            <button className={styles.btnPrimary} onClick={handleRetry}>
              Try Again
            </button>
          </>
        )}

        {scanning && matchStatus !== STATUS.FAILED && matchStatus !== STATUS.SUCCESS && (
          <button className={styles.btnSecondary} onClick={handleCancel}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
