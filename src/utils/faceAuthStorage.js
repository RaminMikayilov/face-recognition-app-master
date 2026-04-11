const STORAGE_KEY = 'face_auth_profiles';

export function getProfiles() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return parsed.map((p) => ({
      name: p.name,
      descriptor: new Float32Array(p.descriptor),
    }));
  } catch {
    return [];
  }
}

export function saveProfile(name, descriptor) {
  const profiles = getProfiles();
  const existing = profiles.findIndex((p) => p.name === name);
  const entry = { name, descriptor: Array.from(descriptor) };
  if (existing >= 0) {
    profiles[existing] = entry;
  } else {
    profiles.push(entry);
  }
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(profiles.map((p) => ({ name: p.name, descriptor: Array.from(p.descriptor) })))
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
    JSON.stringify(profiles.map((p) => ({ name: p.name, descriptor: Array.from(p.descriptor) })))
  );
}

export function hasProfiles() {
  return getProfiles().length > 0;
}
