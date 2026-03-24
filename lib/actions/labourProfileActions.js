import { calculateLabourRate } from "@/lib/calculations/labourLoadedRateNz";

function getSafeRandomId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `labour-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function buildLabourProfile({
  form,
  selectedOverheadProfileId,
  normaliseFormForCalculation,
  existingProfile = null,
  forcedId = null,
  createdAt = null,
}) {
  // OPTION B:
  // Labour profiles store labour-only results.
  // Overheads stay separate and are only linked by ID.
  const calculatedResults = calculateLabourRate({
    ...normaliseFormForCalculation(form),
  });

  const now = new Date().toISOString();

  return {
    ...(existingProfile || {}),
    ...form,
    id: forcedId || existingProfile?.id || form.id || getSafeRandomId(),
    results: calculatedResults,
    selectedOverheadProfileId: selectedOverheadProfileId || "",
    createdAt: createdAt || existingProfile?.createdAt || form.createdAt || now,
    updatedAt: now,
  };
}

export function insertProfile(profiles, profile) {
  return [profile, ...profiles];
}

export function replaceProfile(profiles, updatedProfile) {
  return profiles.map((profile) =>
    String(profile.id) === String(updatedProfile.id) ? updatedProfile : profile
  );
}

export function removeProfile(profiles, id) {
  return profiles.filter((profile) => String(profile.id) !== String(id));
}

export function buildDuplicatedLabourProfile({
  profile,
  overheadProfiles,
  defaultForm,
  normaliseFormForCalculation,
}) {
  const newForm = {
    ...defaultForm,
    ...profile,
  };

  const duplicatedOverheadProfileId = profile.selectedOverheadProfileId || "";
  const now = new Date().toISOString();

  // OPTION B:
  // Duplicate keeps the overhead link, but stored results remain labour-only.
  const recalculatedResults = calculateLabourRate({
    ...normaliseFormForCalculation(newForm),
  });

  return {
    ...newForm,
    id: getSafeRandomId(),
    results: recalculatedResults,
    selectedOverheadProfileId: duplicatedOverheadProfileId,
    createdAt: now,
    updatedAt: now,
    staffTag: profile.staffTag ? `${profile.staffTag}-COPY` : "",
    staffName: profile.staffName
      ? `${profile.staffName} (Copy)`
      : "Copied Profile",
  };
}