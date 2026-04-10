import { useEffect, useRef, useState, useCallback } from 'react';
import * as faceapi from 'face-api.js';
import { loadFaceApiModels } from '../utils/faceApiLoader';
import { clearCanvas, drawFaceBoxes, syncCanvasSize } from '../utils/drawDetections';
import { DETECTION_OPTIONS, FPS_SAMPLE_WINDOW } from '../constants/config';

export const MODEL_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  READY: 'ready',
  ERROR: 'error',
};

export function useFaceDetection(videoRef, canvasRef, isActive) {
  const [modelStatus, setModelStatus] = useState(MODEL_STATUS.IDLE);
  const [modelLoadStep, setModelLoadStep] = useState(null);
  const [detections, setDetections] = useState([]);
  const [fps, setFps] = useState(0);

  const rafRef = useRef(null);
  const fpsTimestamps = useRef([]);

  useEffect(() => {
    setModelStatus(MODEL_STATUS.LOADING);
    loadFaceApiModels(({ step, total, name }) => {
      setModelLoadStep({ step, total, name });
    })
      .then(() => setModelStatus(MODEL_STATUS.READY))
      .catch((err) => {
        console.error('Model load failed:', err);
        setModelStatus(MODEL_STATUS.ERROR);
      });
  }, []);

  const runDetection = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || video.readyState < 2) {
      rafRef.current = requestAnimationFrame(runDetection);
      return;
    }

    syncCanvasSize(canvas, video);

    try {
      const results = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions(DETECTION_OPTIONS))
        .withFaceLandmarks(true)
        .withFaceDescriptors();

      clearCanvas(canvas);
      drawFaceBoxes(canvas, results);
      setDetections(results);
    } catch {
      // Video element may have been torn down mid-frame; skip this frame
    }

    const now = performance.now();
    fpsTimestamps.current.push(now);
    if (fpsTimestamps.current.length > FPS_SAMPLE_WINDOW) {
      fpsTimestamps.current.shift();
    }
    if (fpsTimestamps.current.length >= 2) {
      const elapsed =
        fpsTimestamps.current.at(-1) - fpsTimestamps.current[0];
      setFps(
        Math.round(((fpsTimestamps.current.length - 1) / elapsed) * 1000)
      );
    }

    rafRef.current = requestAnimationFrame(runDetection);
  }, [videoRef, canvasRef]);

  useEffect(() => {
    if (modelStatus === MODEL_STATUS.READY && isActive) {
      rafRef.current = requestAnimationFrame(runDetection);
    }
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [modelStatus, isActive, runDetection]);

  // Clear canvas and stats when camera stops
  useEffect(() => {
    if (!isActive && canvasRef.current) {
      clearCanvas(canvasRef.current);
      setDetections([]);
      setFps(0);
      fpsTimestamps.current = [];
    }
  }, [isActive, canvasRef]);

  return { modelStatus, modelLoadStep, detections, fps };
}
