import { useState, useCallback, useEffect, useMemo } from 'react'
import * as faceapi from 'face-api.js'
import { getProfiles, saveProfile, deleteProfile } from '../utils/profileStorage'
import { FACE_MATCH_THRESHOLD } from '../constants/config'
import { AuthContext } from './authContext'
import { AUTH_STATE } from './authState'

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(AUTH_STATE.UNAUTHENTICATED)
  const [currentUser, setCurrentUser] = useState(null)
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    getProfiles()
      .then((list) => {
        if (!cancelled) setProfiles(list)
      })
      .catch((err) => {
        console.error('Failed to load profiles', err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const matcher = useMemo(() => {
    if (profiles.length === 0) return null
    const labeled = profiles.map((p) => new faceapi.LabeledFaceDescriptors(p.name, [p.descriptor]))
    return new faceapi.FaceMatcher(labeled, FACE_MATCH_THRESHOLD)
  }, [profiles])

  const register = useCallback(async (name, descriptor) => {
    await saveProfile(name, descriptor)
    const updated = await getProfiles()
    setProfiles(updated)
    setCurrentUser(name)
    setAuthState(AUTH_STATE.AUTHENTICATED)
  }, [])

  const login = useCallback((name) => {
    setCurrentUser(name)
    setAuthState(AUTH_STATE.AUTHENTICATED)
  }, [])

  const logout = useCallback(() => {
    setCurrentUser(null)
    setAuthState(AUTH_STATE.UNAUTHENTICATED)
  }, [])

  const removeProfile = useCallback(async (name) => {
    await deleteProfile(name)
    const updated = await getProfiles()
    setProfiles(updated)
    if (currentUser === name) {
      setCurrentUser(null)
      setAuthState(AUTH_STATE.UNAUTHENTICATED)
    }
  }, [currentUser])

  const currentRole = profiles.find((p) => p.name === currentUser)?.role ?? 'user'

  const value = {
    authState,
    currentUser,
    currentRole,
    profiles,
    matcher,
    loading,
    hasProfiles: profiles.length > 0,
    register,
    login,
    logout,
    removeProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
