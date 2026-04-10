import styles from './DetectionStats.module.css';

export function DetectionStats({ detections, fps }) {
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
            const score = (det.score * 100).toFixed(1);
            return (
              <li key={i} className={styles.faceItem}>
                <div className={styles.faceTitle}>Face {i + 1}</div>
                <div className={styles.faceRow}>
                  <span>Confidence</span>
                  <span>{score}%</span>
                </div>
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
