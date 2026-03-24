import {
  LABOUR_STORAGE_KEY,
  OVERHEAD_DRAFT_KEY,
  OVERHEAD_STORAGE_KEY,
} from "@/lib/constants/overheadDefaults";

function safeParseArray(value) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function safeParseObject(value) {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function canUseStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function loadOverheadProfiles() {
  if (!canUseStorage()) return [];
  return safeParseArray(localStorage.getItem(OVERHEAD_STORAGE_KEY));
}

export function saveOverheadProfiles(profiles) {
  if (!canUseStorage()) return;
  localStorage.setItem(OVERHEAD_STORAGE_KEY, JSON.stringify(profiles));
}

export function loadLabourProfiles() {
  if (!canUseStorage()) return [];
  return safeParseArray(localStorage.getItem(LABOUR_STORAGE_KEY));
}

export function loadOverheadDraft() {
  if (!canUseStorage()) return null;
  return safeParseObject(localStorage.getItem(OVERHEAD_DRAFT_KEY));
}

export function saveOverheadDraft(form) {
  if (!canUseStorage()) return;
  localStorage.setItem(OVERHEAD_DRAFT_KEY, JSON.stringify(form));
}

export function clearOverheadDraft() {
  if (!canUseStorage()) return;
  localStorage.removeItem(OVERHEAD_DRAFT_KEY);
}