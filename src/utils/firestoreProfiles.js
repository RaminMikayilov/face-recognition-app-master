import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase/config'

const PROFILES_COLLECTION = 'profiles'

export async function getProfilesFromFirestore() {
  const snapshot = await getDocs(collection(db, PROFILES_COLLECTION))
  return snapshot.docs.map((d) => {
    const data = d.data()
    return {
      name: data.name ?? d.id,
      descriptor: new Float32Array(data.descriptor),
      role: data.role ?? 'user',
    }
  })
}

export async function saveProfileToFirestore(name, descriptor, role = 'user') {
  await setDoc(doc(db, PROFILES_COLLECTION, name), {
    name,
    descriptor: Array.from(descriptor),
    role,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteProfileFromFirestore(name) {
  await deleteDoc(doc(db, PROFILES_COLLECTION, name))
}

export async function isNameTakenInFirestore(name) {
  const snap = await getDoc(doc(db, PROFILES_COLLECTION, name))
  return snap.exists()
}
