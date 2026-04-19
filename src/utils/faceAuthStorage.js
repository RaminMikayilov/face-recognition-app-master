const STORAGE_KEY = 'face_auth_profiles';

export function getProfiles() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return parsed.map((p) => ({
      name: p.name,
      descriptor: new Float32Array(p.descriptor),
      role: p.role ?? 'user',
    }));
  } catch {
    return [];
  }
}

export function saveProfile(name, descriptor, role = 'user') {
  const profiles = getProfiles();
  const existing = profiles.findIndex((p) => p.name === name);
  const entry = { name, descriptor: Array.from(descriptor), role };
  if (existing >= 0) {
    profiles[existing] = entry;
  } else {
    profiles.push(entry);
  }
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(profiles.map((p) => ({ name: p.name, descriptor: Array.from(p.descriptor), role: p.role })))
  );
}

export function isNameTaken(name) {
  return getProfiles().some((p) => p.name === name);
}

export function getMatchingProfile(descriptor, threshold) {
  const profiles = getProfiles();
  for (const p of profiles) {
    const dist = Math.sqrt(
      descriptor.reduce((sum, val, i) => sum + (val - p.descriptor[i]) ** 2, 0)
    );
    if (dist < threshold) return p.name;
  }
  return null;
}

export function deleteProfile(name) {
  const profiles = getProfiles().filter((p) => p.name !== name);
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(profiles.map((p) => ({ name: p.name, descriptor: Array.from(p.descriptor), role: p.role })))
  );
}

export function hasProfiles() {
  return getProfiles().length > 0;
}

const SESSION_KEY = 'face_auth_session';

export function getSessionUser() {
  return localStorage.getItem(SESSION_KEY) ?? null;
}

export function setSessionUser(name) {
  localStorage.setItem(SESSION_KEY, name);
}

export function clearSessionUser() {
  localStorage.removeItem(SESSION_KEY);
}
