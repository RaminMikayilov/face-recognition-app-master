# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev           # Start Vite dev server
npm run build         # Production build
npm run lint          # ESLint (v9 flat config)
npm run preview       # Preview production build locally
npm run download-models  # Download face-api.js TensorFlow models to /public/models
```

No test framework is configured.

## Environment Setup

Copy `.env.example` to `.env` and fill Firebase credentials. Firebase is **optional** — if `VITE_FIREBASE_API_KEY` and `VITE_FIREBASE_PROJECT_ID` are absent, the app falls back to localStorage-only mode.

Face-api.js model files must exist in `/public/models/` before the app can perform recognition. Run `npm run download-models` once after cloning.

## Architecture

**Stack**: React 19 + Vite, React Router v7, PrimeReact UI, face-api.js (TensorFlow.js wrapper), i18next (Azerbaijani default / English fallback).

### Client-Side Face Authentication

There is no backend or server-side auth. Face recognition runs entirely in-browser:
1. `ModelLoader` loads 3 TensorFlow.js models (TinyFaceDetector → FaceLandmarks → FaceRecognition) from `/public/models/`
2. Registration extracts a 128-dimension face descriptor from webcam frames via face-api.js
3. Login compares a live descriptor against stored descriptors using `FaceMatcher` (Euclidean distance, threshold `0.6` in `src/constants/config.js`)

### State Management

`AuthContext.jsx` is the single source of truth, wrapping the entire app. It holds: current user, all profiles, and the `FaceMatcher` instance. Access via `useAuth()` hook. No Redux or Zustand.

### Hybrid Storage (Non-Obvious)

`src/utils/profileStorage.js` is a dual-write abstraction:
- Always writes to **localStorage** (`faceAuthStorage.js`) as the offline-first cache
- Also writes to **Firestore** (`firestoreProfiles.js`) when `isFirebaseEnabled` is true
- FaceDescriptors are serialized `Float32Array`s — handle carefully when transforming

### Key Files

| File | Purpose |
|------|---------|
| `src/App.jsx` | Router, AuthProvider, ModelLoader composition |
| `src/context/AuthContext.jsx` | All auth logic: login, register, logout, profile CRUD |
| `src/hooks/useCamera.js` | `MediaDevices.getUserMedia` lifecycle management |
| `src/utils/profileStorage.js` | Firestore + localStorage abstraction |
| `src/constants/config.js` | Face match threshold, model paths, detection options |
| `src/firebase/config.js` | Conditional Firebase init via `isFirebaseEnabled` flag |

### Theming & i18n

Dark/light modes use CSS custom properties (`--text-h`, `--card-bg`, `--success`, etc.) toggled by `ThemeToggle`. Add new theme-aware colors as CSS variables, not hardcoded values.

i18next is initialized in `src/i18.js`. All user-facing strings must have entries in both `src/locales/en.json` and `src/locales/az.json`.

### Vite Bundle Splitting

`vite.config.js` manually chunks face-api.js + TensorFlow into a separate bundle to avoid bloating the main bundle. Maintain this when adding other large ML/wasm dependencies.
