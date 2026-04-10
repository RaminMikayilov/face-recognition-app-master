import { useState, useEffect } from 'react';
import { loadFaceApiModels } from '../utils/faceApiLoader';
import { AUTH_STATE } from '../hooks/useFaceAuth';
import { RegisterFace } from './RegisterFace';
import { LoginFace } from './LoginFace';
import styles from './AuthGate.module.css';

export function AuthGate({ auth, children }) {
  const [modelsReady, setModelsReady] = useState(false);
  const [modelError, setModelError] = useState(null);
  const [loadStep, setLoadStep] = useState(null);
  const [activeTab, setActiveTab] = useState('login');

  const { authState, currentUser, hasProfiles, matcher, register, login, logout } = auth;

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

  if (authState === AUTH_STATE.AUTHENTICATED) {
    return (
      <div style={{ width: '100%' }}>
        <div className={styles.userBanner}>
          <span className={styles.welcomeText}>Welcome, {currentUser}!</span>
          <button className={styles.btnLogout} onClick={logout}>
            Log Out
          </button>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.appHeader}>
        <h1>Face Recognition</h1>
        <p>Authenticate with your face to continue</p>
      </div>

      {hasProfiles ? (
        <>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'login' ? styles.active : ''}`}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'register' ? styles.active : ''}`}
              onClick={() => setActiveTab('register')}
            >
              Register
            </button>
          </div>

          {activeTab === 'login' ? (
            <LoginFace key="login" matcher={matcher} onLogin={login} />
          ) : (
            <RegisterFace onRegister={register} />
          )}
        </>
      ) : (
        <RegisterFace onRegister={register} />
      )}
    </div>
  );
}
