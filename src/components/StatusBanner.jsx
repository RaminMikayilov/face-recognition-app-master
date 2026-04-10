import styles from './StatusBanner.module.css';

export function StatusBanner({ modelStatus, modelLoadStep, cameraStatus, cameraError }) {
  if (cameraError) {
    return <div className={`${styles.banner} ${styles.error}`}>{cameraError}</div>;
  }

  if (cameraStatus === 'requesting') {
    return (
      <div className={`${styles.banner} ${styles.info}`}>Requesting camera access...</div>
    );
  }

  if (modelStatus === 'loading') {
    const label = modelLoadStep
      ? `Loading models (${modelLoadStep.step}/${modelLoadStep.total}): ${modelLoadStep.name}...`
      : 'Loading face detection models...';
    return <div className={`${styles.banner} ${styles.info}`}>{label}</div>;
  }

  if (modelStatus === 'error') {
    return (
      <div className={`${styles.banner} ${styles.error}`}>
        Failed to load models. Make sure you ran{' '}
        <code>npm run download-models</code> to populate{' '}
        <code>public/models/</code>.
      </div>
    );
  }

  if (cameraStatus === 'active' && modelStatus === 'ready') {
    return (
      <div className={`${styles.banner} ${styles.success}`}>Detection running</div>
    );
  }

  if (modelStatus === 'ready') {
    return (
      <div className={`${styles.banner} ${styles.info}`}>
        Models loaded — click Start Camera to begin
      </div>
    );
  }

  return null;
}
