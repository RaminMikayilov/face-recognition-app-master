import { useState, useEffect } from 'react';
import { loadFaceApiModels } from '../../utils/faceApiLoader';
import styles from '../Layout.module.css';

export function ModelLoader({ children }) {
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
        setModelError(
          'Failed to load face detection models. Make sure you ran npm run download-models.'
        );
      });
  }, []);

  if (modelError) {
    return (
      <div className={styles.loading}>
        <span style={{ color: '#f87171' }}>{modelError}</span>
      </div>
    );
  }

  if (!modelsReady) {
    const label = loadStep
      ? `Loading model ${loadStep.step}/${loadStep.total}: ${loadStep.name}...`
      : 'Loading face detection models...';
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <span>{label}</span>
      </div>
    );
  }

  return children;
}
