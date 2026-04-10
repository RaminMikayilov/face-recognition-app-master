import styles from './CameraView.module.css';

export function CameraView({ videoRef, canvasRef, isActive }) {
  return (
    <div className={styles.wrapper}>
      <video
        ref={videoRef}
        className={styles.video}
        autoPlay
        muted
        playsInline
      />
      <canvas ref={canvasRef} className={styles.overlay} aria-hidden="true" />
      {!isActive && (
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
            <path d="M23 7l-7 5 7 5V7z" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
          </svg>
          <span>Camera is off</span>
        </div>
      )}
    </div>
  );
}
