function buildProfilePayload({
  baseProfile = {},
  form,
  summary,
  selectedLabourProfile = null,
  preserveId = "",
  preserveCreatedAt = "",
}) {
  const now = new Date().toISOString();

  const labourProfileId =
    selectedLabourProfile?.id || form.labourProfileId || "";
  const labourStaffName =
    selectedLabourProfile?.staffName || form.staffName || "";
  const labourRole =
    selectedLabourProfile?.role || form.role || "";

  return {
    ...baseProfile,
    ...form,

    id: preserveId || form.id || crypto.randomUUID(),
    createdAt: preserveCreatedAt || form.createdAt || now,
    updatedAt: now,

    labourProfileId,
    linkedLabourProfileId: labourProfileId,
    linkedLabourProfileName: labourStaffName,
    staffName: labourStaffName,
    role: labourRole,

    rowSummaries: summary.rowSummaries,
    generalAnnualOverhead: summary.generalAnnualOverhead,
    vehicleAnnualCost: summary.vehicle.vehicleAnnualCost,
    vehicleCostPerHour: summary.vehicle.vehicleCostPerHour,
    vehicleRecoveryBasis: form.vehicleRecoveryBasis,
    totalAnnualOverhead: summary.totalAnnualOverhead,
    totalOverheadPerHour: summary.totalOverheadPerHour,
    generalPct: summary.generalPct,
    vehiclePct: summary.vehiclePct,
  };
}

export function createOverheadProfile({
  form,
  summary,
  selectedLabourProfile,
}) {
  return buildProfilePayload({
    form,
    summary,
    selectedLabourProfile,
  });
}

export function updateOverheadProfile({
  existingProfile,
  form,
  summary,
  selectedLabourProfile,
}) {
  return buildProfilePayload({
    baseProfile: existingProfile || {},
    form,
    summary,
    selectedLabourProfile,
    preserveId: form.id || existingProfile?.id,
    preserveCreatedAt: existingProfile?.createdAt || form.createdAt,
  });
}

export function upsertProfile(profiles, profile) {
  const exists = profiles.some((p) => String(p.id) === String(profile.id));

  if (!exists) {
    return [profile, ...profiles];
  }

  return profiles.map((p) =>
    String(p.id) === String(profile.id) ? profile : p
  );
}

export function deleteOverheadProfile(profiles, id) {
  return profiles.filter((p) => String(p.id) !== String(id));
}