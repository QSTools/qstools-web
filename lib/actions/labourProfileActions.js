import { calculateLabourRate } from "@/lib/calculations/labourLoadedRateNz";

export function buildLabourProfile({
  form,
  selectedOverheadProfileId,
  overheadPerProductiveHour,
  normaliseFormForCalculation,
  existingProfile = null,
  forcedId = null,
  createdAt = null,
}) {
  const calculatedResults = calculateLabourRate({
    ...normaliseFormForCalculation(form),
    overheadPerHour: overheadPerProductiveHour,
  });

  const now = new Date().toISOString();

  return {
    ...(existingProfile || {}),
    ...form,
    id: forcedId || existingProfile?.id || form.id || crypto.randomUUID(),
    results: calculatedResults,
    selectedOverheadProfileId,
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

  const duplicatedOverheadProfile =
    overheadProfiles.find(
      (p) => String(p.id) === String(duplicatedOverheadProfileId)
    ) || null;

  const duplicatedTotalAnnualOverhead = Number(
    duplicatedOverheadProfile?.totalAnnualOverhead || 0
  );

  const duplicatedPaidHoursPerYear = Number(newForm.hoursPerWeek || 0) * 52;
  const duplicatedProductiveHoursPerYear =
    duplicatedPaidHoursPerYear * (Number(newForm.efficiencyPct || 0) / 100);

  const duplicatedOverheadPerProductiveHour =
    duplicatedProductiveHoursPerYear > 0
      ? duplicatedTotalAnnualOverhead / duplicatedProductiveHoursPerYear
      : 0;

  const recalculatedResults = calculateLabourRate({
    ...normaliseFormForCalculation(newForm),
    overheadPerHour: duplicatedOverheadPerProductiveHour,
  });

  const now = new Date().toISOString();

  return {
    ...newForm,
    id: crypto.randomUUID(),
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