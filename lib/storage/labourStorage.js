const STORAGE_KEY = "qs-tools-labour-profiles";
const LABOUR_DRAFT_KEY = "qs-tools-labour-draft";
const OVERHEAD_STORAGE_KEY = "qs-tools-overhead-profiles";

function safeParseArray(value) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function safeParseObject(value, fallback = null) {
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function loadLabourProfiles() {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return [];
  return safeParseArray(saved);
}

export function saveLabourProfiles(profiles) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles || []));
}

export function loadLabourDraft() {
  if (typeof window === "undefined") return null;
  const saved = localStorage.getItem(LABOUR_DRAFT_KEY);
  if (!saved) return null;
  return safeParseObject(saved, null);
}

export function saveLabourDraft(draft) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LABOUR_DRAFT_KEY, JSON.stringify(draft || {}));
}

export function clearLabourDraft() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LABOUR_DRAFT_KEY);
}

export function loadOverheadProfiles() {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem(OVERHEAD_STORAGE_KEY);
  if (!saved) return [];
  return safeParseArray(saved);
}

export const labourStorageKeys = {
  STORAGE_KEY,
  LABOUR_DRAFT_KEY,
  OVERHEAD_STORAGE_KEY,
};