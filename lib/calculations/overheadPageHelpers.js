export function getOverheadFlags({
  totalAnnualOverhead,
  totalOverheadPerHour,
  generalAnnualOverhead,
  vehicleAnnualCost,
  generalPct,
  vehiclePct,
  vehicleEnabled,
}) {
  const flags = [];

  if (totalAnnualOverhead <= 0) {
    flags.push({
      type: "warning",
      title: "No overheads included",
      message:
        "This profile currently has no annual overheads. The result may understate the true business cost.",
    });

    return flags;
  }

  if (!vehicleEnabled || vehicleAnnualCost <= 0) {
    flags.push({
      type: "caution",
      title: "No vehicle cost included",
      message:
        "Vehicle costs are excluded. That may be correct for some roles, but many field-based staff will need transport cost recovery.",
    });
  }

  if (generalAnnualOverhead <= 0) {
    flags.push({
      type: "caution",
      title: "No general overheads included",
      message:
        "Phone, PPE, tools, software, training, and similar recurring costs are all currently excluded.",
    });
  }

  if (vehiclePct >= 70) {
    flags.push({
      type: "warning",
      title: "Vehicle-heavy overhead profile",
      message:
        "Vehicle costs make up most of this profile. Check that all other staff overheads are captured and that vehicle assumptions are realistic.",
    });
  }

  if (generalPct >= 70) {
    flags.push({
      type: "warning",
      title: "General overheads dominate",
      message:
        "General staff overheads are carrying most of the annual total. Check whether vehicle allocation should also be included.",
    });
  }

  if (totalOverheadPerHour > 0 && totalOverheadPerHour < 5) {
    flags.push({
      type: "warning",
      title: "Very low overhead per hour",
      message:
        "The recovered overhead per hour looks unusually low. Check recovery hours and whether key costs have been omitted.",
    });
  }

  if (totalOverheadPerHour >= 5 && totalOverheadPerHour <= 20) {
    flags.push({
      type: "healthy",
      title: "Reasonable overhead per hour",
      message:
        "The hourly overhead recovery looks broadly plausible for a staff-level overhead profile.",
    });
  }

  if (vehicleAnnualCost > 0 && generalAnnualOverhead > 0) {
    if (vehiclePct >= 35 && vehiclePct <= 65) {
      flags.push({
        type: "healthy",
        title: "Balanced overhead split",
        message:
          "Vehicle and general overheads are reasonably balanced across the profile.",
      });
    }
  }

  return flags;
}

export function getProfileStatus({
  form,
  selectedLabourProfile,
}) {
  const isEditing = Boolean(form?.id);

  return {
    isEditing,
    heading: isEditing
      ? `Editing: ${form?.profileName || "Unnamed Profile"}`
      : "New Overhead Profile",
    subheading: selectedLabourProfile
      ? `Linked to: ${
          selectedLabourProfile.staffName || "Unnamed Staff"
        }${selectedLabourProfile.role ? ` (${selectedLabourProfile.role})` : ""}`
      : "No labour profile linked",
  };
}