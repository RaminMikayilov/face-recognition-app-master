import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { loadFaceApiModels } from '../../utils/faceApiLoader';
import styles from '../Layout.module.css';

export function ModelLoader({ children }) {
  const { t } = useTranslation();
  const [modelsReady, setModelsReady] = useState(false);
  const [modelError, setModelError] = useState(null);
  const [loadStep, setLoadStep] = useState(null);

  useEffect(() => {
    loadFaceApiModels(({ step, total, name }) => {
      setLoadStep({ step, total, name });
    })
      .then(() => setModelsReady(true))
      .catch((err) => {
        console.error('Model load failed:', err);
        setModelError(t('modelLoadError'));
      });
  }, [t]);

  if (modelError) {
    return (
      <div className={styles.loading}>
        <span role="alert" style={{ color: 'var(--danger)' }}>{modelError}</span>
      </div>
    );
  }

  if (!modelsReady) {
    const progress = loadStep ? (loadStep.step / loadStep.total) * 100 : 0;
    const label = loadStep
      ? t('initFaceDetection', { name: loadStep.name })
      : t('loadingSystemModels');

    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <span aria-live="polite" className={styles.loadingText}>{label}</span>
        <div
          className={styles.progressContainer}
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={t('loadingModels')}
        >
          <div
            className={styles.progressBar}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  }

  return children;
}
