import { useRef, useState, useCallback, useEffect } from 'react';

export const CAMERA_STATUS = {
  IDLE: 'idle',
  REQUESTING: 'requesting',
  ACTIVE: 'active',
  DENIED: 'denied',
  NOT_FOUND: 'not_found',
  ERROR: 'error',
};

export function useCamera() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [status, setStatus] = useState(CAMERA_STATUS.IDLE);
  const [error, setError] = useState(null);

  const startCamera = useCallback(async () => {
    setStatus(CAMERA_STATUS.REQUESTING);
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setStatus(CAMERA_STATUS.ACTIVE);
    } catch (err) {
      streamRef.current = null;
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setStatus(CAMERA_STATUS.DENIED);
        setError('Camera permission was denied. Allow camera access and try again.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setStatus(CAMERA_STATUS.NOT_FOUND);
        setError('No camera device found on this machine.');
      } else {
        setStatus(CAMERA_STATUS.ERROR);
        setError(`Camera error: ${err.message}`);
      }
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStatus(CAMERA_STATUS.IDLE);
    setError(null);
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  return { videoRef, status, error, startCamera, stopCamera };
}
