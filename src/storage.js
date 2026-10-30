const STORAGE_KEY = 'learntrace:v1';

export function readWorkspace() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function writeWorkspace(workspace) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace));
    return true;
  } catch {
    return false;
  }
}

export function clearWorkspace() {
  localStorage.removeItem(STORAGE_KEY);
}
