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

function writeCache(profiles) {
  try {
    const serialized = JSON.stringify(
      profiles.map((p) => ({ name: p.name, descriptor: Array.from(p.descriptor) })),
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
  if (!isFirebaseEnabled) {
    saveProfileToLocal(name, descriptor)
    return
  }
  await saveProfileToFirestore(name, descriptor)
  saveProfileToLocal(name, descriptor)
}

export async function deleteProfile(name) {
  if (!isFirebaseEnabled) {
    deleteProfileFromLocal(name)
    return
  }
  await deleteProfileFromFirestore(name)
  deleteProfileFromLocal(name)
}

export async function isNameTaken(name) {
  if (!isFirebaseEnabled) return isNameTakenInLocal(name)
  try {
    return await isNameTakenInFirestore(name)
  } catch {
    return isNameTakenInLocal(name)
  }
}
