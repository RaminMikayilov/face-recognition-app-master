import { useMemo } from 'react';
import { FACE_MATCH_THRESHOLD } from '../constants/config';
import styles from './DetectionStats.module.css';

export function DetectionStats({ detections, fps, matcher }) {
  const matchedNames = useMemo(() => {
    if (!matcher) return [];
    return detections.map((det) => {
      if (!det.descriptor) return null;
      const match = matcher.findBestMatch(det.descriptor);
      return match.distance < FACE_MATCH_THRESHOLD ? match.label : 'Unknown';
    });
  }, [detections, matcher]);

  return (
    <aside className={styles.panel}>
      <div className={styles.header}>
        <h2>Detection Data</h2>
        <span className={styles.fpsTag}>{fps} FPS</span>
      </div>

      <div className={styles.summary}>
        <span className={styles.countLabel}>Faces detected</span>
        <span className={styles.countValue}>{detections.length}</span>
      </div>

      {detections.length > 0 && (
        <ul className={styles.faceList}>
          {detections.map((det, i) => {
            const score = ((det.detection ? det.detection.score : det.score) * 100).toFixed(1);
            const name = matchedNames[i];
            return (
              <li key={i} className={styles.faceItem}>
                <div className={styles.faceTitle}>{name || `Face ${i + 1}`}</div>
                <div className={styles.faceRow}>
                  <span>Confidence</span>
                  <span>{score}%</span>
                </div>
                {name && name !== 'Unknown' && (
                  <div className={styles.faceRow}>
                    <span>Identity</span>
                    <span style={{ color: '#00ff88' }}>{name}</span>
                  </div>
                )}
                {name === 'Unknown' && (
                  <div className={styles.faceRow}>
                    <span>Identity</span>
                    <span style={{ color: '#f87171' }}>Unknown</span>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {detections.length === 0 && (
        <p className={styles.noFace}>No faces in frame</p>
      )}
    </aside>
  );
}
