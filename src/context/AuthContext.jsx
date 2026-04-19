import { useState, useCallback, useEffect, useMemo } from 'react'
import * as faceapi from 'face-api.js'
import { getProfiles, saveProfile, deleteProfile, renameProfile as renameProfileStorage } from '../utils/profileStorage'
import { getSessionUser, setSessionUser, clearSessionUser } from '../utils/faceAuthStorage'
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
        if (!cancelled) {
          setProfiles(list)
          const saved = getSessionUser()
          if (saved && list.some((p) => p.name === saved)) {
            setCurrentUser(saved)
            setAuthState(AUTH_STATE.AUTHENTICATED)
          }
        }
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
    setSessionUser(name)
    setCurrentUser(name)
    setAuthState(AUTH_STATE.AUTHENTICATED)
  }, [])

  const login = useCallback((name) => {
    setSessionUser(name)
    setCurrentUser(name)
    setAuthState(AUTH_STATE.AUTHENTICATED)
  }, [])

  const logout = useCallback(() => {
    clearSessionUser()
    setCurrentUser(null)
    setAuthState(AUTH_STATE.UNAUTHENTICATED)
  }, [])

  const removeProfile = useCallback(async (name) => {
    await deleteProfile(name)
    const updated = await getProfiles()
    setProfiles(updated)
    if (currentUser === name) {
      clearSessionUser()
      setCurrentUser(null)
      setAuthState(AUTH_STATE.UNAUTHENTICATED)
    }
  }, [currentUser])

  const renameProfile = useCallback(async (oldName, newName) => {
    await renameProfileStorage(oldName, newName)
    const updated = await getProfiles()
    setProfiles(updated)
    if (currentUser === oldName) {
      setSessionUser(newName)
      setCurrentUser(newName)
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
    renameProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
