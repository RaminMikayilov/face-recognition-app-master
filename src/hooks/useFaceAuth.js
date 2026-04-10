import { useState, useCallback, useMemo } from 'react';
import * as faceapi from 'face-api.js';
import { getProfiles, saveProfile, hasProfiles } from '../utils/faceAuthStorage';
import { FACE_MATCH_THRESHOLD } from '../constants/config';

export const AUTH_STATE = {
  UNAUTHENTICATED: 'unauthenticated',
  AUTHENTICATED: 'authenticated',
};

export function useFaceAuth() {
  const [authState, setAuthState] = useState(AUTH_STATE.UNAUTHENTICATED);
  const [currentUser, setCurrentUser] = useState(null);
  // Track profiles in state so components re-render when a new face is registered
  const [profiles, setProfiles] = useState(() => getProfiles());

  const matcher = useMemo(() => {
    if (profiles.length === 0) return null;
    const labeled = profiles.map(
      (p) => new faceapi.LabeledFaceDescriptors(p.name, [p.descriptor])
    );
    return new faceapi.FaceMatcher(labeled, FACE_MATCH_THRESHOLD);
  }, [profiles]);

  const register = useCallback((name, descriptor) => {
    saveProfile(name, descriptor);
    const updated = getProfiles();
    setProfiles(updated);
    setCurrentUser(name);
    setAuthState(AUTH_STATE.AUTHENTICATED);
  }, []);

  const login = useCallback((name) => {
    setCurrentUser(name);
    setAuthState(AUTH_STATE.AUTHENTICATED);
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setAuthState(AUTH_STATE.UNAUTHENTICATED);
  }, []);

  return {
    authState,
    currentUser,
    profiles,
    matcher,
    hasProfiles: profiles.length > 0,
    register,
    login,
    logout,
  };
}
