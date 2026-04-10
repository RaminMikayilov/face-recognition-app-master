import * as faceapi from 'face-api.js';
import { MODEL_URL } from '../constants/config';

let loaded = false;

export async function loadFaceApiModels(onProgress) {
  if (loaded) return;

  const models = [
    {
      name: 'Tiny Face Detector',
      load: () => faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    },
    {
      name: 'Face Landmarks',
      load: () => faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL),
    },
    {
      name: 'Face Recognition',
      load: () => faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    },
  ];

  for (let i = 0; i < models.length; i++) {
    onProgress?.({ step: i + 1, total: models.length, name: models[i].name });
    await models[i].load();
  }

  loaded = true;
}

export function areModelsLoaded() {
  return loaded;
}
