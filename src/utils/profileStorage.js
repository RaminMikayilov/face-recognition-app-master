import { isFirebaseEnabled } from '../firebase/config'
import {
  getProfiles as getProfilesFromLocal,
  saveProfile as saveProfileToLocal,
  deleteProfile as deleteProfileFromLocal,
  isNameTaken as isNameTakenInLocal,
} from './faceAuthStorage'
import {
  getProfilesFromFirestore,
  saveProfileToFirestore,
  deleteProfileFromFirestore,
  isNameTakenInFirestore,
} from './firestoreProfiles'

const ADMIN_NAME = import.meta.env.VITE_ADMIN_NAME

function resolveRole(name) {
  return ADMIN_NAME && name === ADMIN_NAME ? 'admin' : 'user'
}

function writeCache(profiles) {
  try {
    const serialized = JSON.stringify(
      profiles.map((p) => ({ name: p.name, descriptor: Array.from(p.descriptor), role: p.role })),
    )
    localStorage.setItem('face_auth_profiles', serialized)
  } catch {
    // cache write failures are non-fatal
  }
}

export async function getProfiles() {
  if (!isFirebaseEnabled) return getProfilesFromLocal()
  try {
    const profiles = await getProfilesFromFirestore()
    writeCache(profiles)
    return profiles
  } catch (err) {
    console.warn('Firestore read failed, falling back to localStorage cache', err)
    return getProfilesFromLocal()
  }
}

export async function saveProfile(name, descriptor) {
  const role = resolveRole(name)
  if (!isFirebaseEnabled) {
    saveProfileToLocal(name, descriptor, role)
    return
  }
  await saveProfileToFirestore(name, descriptor, role)
  saveProfileToLocal(name, descriptor, role)
}

export async function deleteProfile(name) {
  if (!isFirebaseEnabled) {
    deleteProfileFromLocal(name)
    return
  }
  await deleteProfileFromFirestore(name)
  deleteProfileFromLocal(name)
}

export async function renameProfile(oldName, newName) {
  const profiles = await getProfiles()
  const existing = profiles.find((p) => p.name === oldName)
  if (!existing) return
  const { descriptor, role } = existing
  if (!isFirebaseEnabled) {
    deleteProfileFromLocal(oldName)
    saveProfileToLocal(newName, descriptor, role)
    return
  }
  await deleteProfileFromFirestore(oldName)
  await saveProfileToFirestore(newName, descriptor, role)
  deleteProfileFromLocal(oldName)
  saveProfileToLocal(newName, descriptor, role)
}

export async function isNameTaken(name) {
  if (!isFirebaseEnabled) return isNameTakenInLocal(name)
  try {
    return await isNameTakenInFirestore(name)
  } catch {
    return isNameTakenInLocal(name)
  }
}
