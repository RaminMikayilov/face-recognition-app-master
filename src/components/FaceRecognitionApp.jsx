import { useRef } from 'react';
import { useCamera, CAMERA_STATUS } from '../hooks/useCamera';
import { useFaceDetection, MODEL_STATUS } from '../hooks/useFaceDetection';
import { CameraView } from './CameraView';
import { DetectionStats } from './DetectionStats';
import { StatusBanner } from './StatusBanner';
import styles from './FaceRecognitionApp.module.css';

export function FaceRecognitionApp() {
  const canvasRef = useRef(null);

  const {
    videoRef,
    status: cameraStatus,
    error: cameraError,
    startCamera,
    stopCamera,
  } = useCamera();

  const isActive = cameraStatus === CAMERA_STATUS.ACTIVE;

  const { modelStatus, modelLoadStep, detections, fps } = useFaceDetection(
    videoRef,
    canvasRef,
    isActive
  );

  const canStart =
    modelStatus === MODEL_STATUS.READY && cameraStatus !== CAMERA_STATUS.ACTIVE;
  const canStop = cameraStatus === CAMERA_STATUS.ACTIVE;

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>Face Recognition</h1>
        <p className={styles.subtitle}>Real-time face detection powered by face-api.js</p>
      </header>

      <StatusBanner
        modelStatus={modelStatus}
        modelLoadStep={modelLoadStep}
        cameraStatus={cameraStatus}
        cameraError={cameraError}
      />

      <div className={styles.layout}>
        <CameraView videoRef={videoRef} canvasRef={canvasRef} isActive={isActive} />
        <DetectionStats detections={detections} fps={fps} />
      </div>

      <div className={styles.controls}>
        <button onClick={startCamera} disabled={!canStart} className={styles.btnStart}>
          Start Camera
        </button>
        <button onClick={stopCamera} disabled={!canStop} className={styles.btnStop}>
          Stop Camera
        </button>
      </div>
    </div>
  );
}
