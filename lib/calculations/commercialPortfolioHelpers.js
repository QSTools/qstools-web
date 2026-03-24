// D:\QSTools\qstools-web\lib\calculations\commercialPortfolioHelpers.js

const LABOUR_STORAGE_KEYS = [
  "qs-tools-labour-profiles",
  "labourProfiles",
  "savedLabourProfiles",
  "qs_labour_profiles",
  "labour_rates_profiles",
];

const OVERHEAD_STORAGE_KEYS = [
  "qs-tools-overhead-profiles",
  "employeeOverheadProfiles",
  "savedOverheadProfiles",
  "qs_overhead_profiles",
  "overhead_profiles",
];

const LOW_PRODUCTIVITY_THRESHOLD = 75;

const STATUS_CONFIG = {
  "missing-overhead": {
    key: "missing-overhead",
    label: "Missing Overhead",
    tone: "warning",
    sort: 1,
  },
  "losing-money": {
    key: "losing-money",
    label: "Losing Money",
    tone: "danger",
    sort: 2,
  },
  "below-target": {
    key: "below-target",
    label: "Below Target",
    tone: "warning",
    sort: 3,
  },
  "low-productivity": {
    key: "low-productivity",
    label: "Low Productivity",
    tone: "caution",
    sort: 4,
  },
  healthy: {
    key: "healthy",
    label: "Healthy",
    tone: "healthy",
    sort: 5,
  },
};

function safeParse(value) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function loadAllMatchingArrays(keys) {
  if (typeof window === "undefined") return [];

  const combined = [];

  for (const key of keys) {
    const raw = window.localStorage.getItem(key);
    if (!raw) continue;

    const parsed = safeParse(raw);

    if (Array.isArray(parsed) && parsed.length) {
      combined.push(...parsed);
    }
  }

  return combined;
}

function detectStorageKey(keys, fallbackKey) {
  if (typeof window === "undefined") return fallbackKey;

  for (const key of keys) {
    const raw = window.localStorage.getItem(key);
    if (raw !== null) return key;
  }

  return fallbackKey;
}

function num(...values) {
  for (const value of values) {
    const n = Number(value);
    if (!Number.isNaN(n) && Number.isFinite(n)) return n;
  }
  return 0;
}

function text(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function normalizeText(value) {
  return text(value).toLowerCase().replace(/\s+/g, " ").trim();
}

function normalizeId(value) {
  return text(value).toLowerCase().trim();
}

function getLabourName(profile) {
  return text(
    profile?.staffName,
    profile?.profileName,
    profile?.name,
    profile?.inputs?.staffName,
    profile?.inputs?.profileName,
    profile?.form?.staffName,
    profile?.form?.profileName,
    profile?.results?.staffName,
    profile?.results?.profileName,
    profile?.results?.inputs?.staffName,
    profile?.results?.inputs?.profileName
  );
}

function getLabourRole(profile) {
  return text(
    profile?.role,
    profile?.inputs?.role,
    profile?.form?.role,
    profile?.results?.role,
    profile?.results?.inputs?.role
  );
}

function getLabourProfileName(profile) {
  return text(
    profile?.profileName,
    profile?.name,
    profile?.staffName,
    profile?.inputs?.profileName,
    profile?.inputs?.staffName,
    profile?.form?.profileName,
    profile?.form?.staffName,
    profile?.results?.profileName,
    profile?.results?.staffName,
    profile?.results?.inputs?.profileName,
    profile?.results?.inputs?.staffName
  );
}

function getChargeoutRate(profile) {
  return num(
    profile?.chargeoutRate,
    profile?.results?.chargeoutRate,
    profile?.results?.profit?.chargeoutRate,
    profile?.results?.commercial?.chargeoutRate,
    profile?.commercial?.chargeoutRate,
    profile?.inputs?.chargeoutRate,
    profile?.form?.chargeoutRate,
    profile?.results?.inputs?.chargeoutRate
  );
}

function getTargetMarginPct(profile) {
  return num(
    profile?.targetMarginPct,
    profile?.results?.targetMarginPct,
    profile?.results?.profit?.targetMarginPct,
    profile?.results?.commercial?.targetMarginPct,
    profile?.commercial?.targetMarginPct,
    profile?.inputs?.targetMarginPct,
    profile?.form?.targetMarginPct,
    profile?.results?.inputs?.targetMarginPct
  );
}

function getLoadedRealCostPerHour(profile) {
  // OPTION B:
  // Only use labour-only recovered cost.
  // Do not fall back to ambiguous top-level fields that may have come from
  // older saved profile structures.
  return num(
    profile?.results?.loaded?.effectiveRecoveredCostPerHourBeforeOverheads,
    profile?.results?.loaded?.effectiveRecoveredCostPerHour,
    profile?.results?.loaded?.effectiveCost,
    profile?.results?.loaded?.realCostPerHour
  );
}

function getRecoveredHours(profile) {
  return num(
    profile?.recoveredHoursPerYear,
    profile?.results?.recoveredHoursPerYear,
    profile?.results?.leave?.recoveredHoursPerYear,
    profile?.leave?.recoveredHoursPerYear
  );
}

function getPaidHours(profile) {
  const directPaidHours = num(
    profile?.paidHoursPerYear,
    profile?.results?.paidHoursPerYear,
    profile?.results?.loaded?.paidHoursPerYear,
    profile?.loaded?.paidHoursPerYear,
    profile?.inputs?.paidHoursPerYear,
    profile?.form?.paidHoursPerYear,
    profile?.results?.inputs?.paidHoursPerYear
  );

  if (directPaidHours > 0) {
    return directPaidHours;
  }

  const hoursPerWeek = num(
    profile?.hoursPerWeek,
    profile?.form?.hoursPerWeek,
    profile?.inputs?.hoursPerWeek,
    profile?.results?.inputs?.hoursPerWeek
  );

  return hoursPerWeek > 0 ? hoursPerWeek * 52 : 0;
}

function getProductivityPct(profile, recoveredHours = 0, paidHours = 0) {
  const directProductivityPct = num(
    profile?.productivityPct,
    profile?.efficiencyPct,
    profile?.results?.productivityPct,
    profile?.results?.efficiencyPct,
    profile?.results?.loaded?.productivityPct,
    profile?.results?.loaded?.efficiencyPct,
    profile?.loaded?.productivityPct,
    profile?.loaded?.efficiencyPct,
    profile?.inputs?.productivityPct,
    profile?.inputs?.efficiencyPct,
    profile?.form?.productivityPct,
    profile?.form?.efficiencyPct,
    profile?.results?.inputs?.productivityPct,
    profile?.results?.inputs?.efficiencyPct
  );

  if (directProductivityPct > 0) {
    return directProductivityPct;
  }

  if (paidHours > 0 && recoveredHours > 0) {
    return (recoveredHours / paidHours) * 100;
  }

  return 0;
}

function getOverheadAnnual(overheadProfile) {
  return num(
    overheadProfile?.totalAnnualOverhead,
    overheadProfile?.totalAnnualOverheads,
    overheadProfile?.annualOverheadTotal,
    overheadProfile?.results?.totalAnnualOverhead,
    overheadProfile?.results?.totalAnnualOverheads,
    overheadProfile?.results?.annualOverheadTotal,
    overheadProfile?.results?.totals?.annualOverheadTotal,
    overheadProfile?.totals?.annualOverheadTotal,
    overheadProfile?.commercial?.annualOverheadTotal
  );
}

function getOverheadName(profile) {
  return text(
    profile?.profileName,
    profile?.name,
    profile?.staffName,
    profile?.linkedLabourProfileName,
    profile?.labourProfileName,
    profile?.selectedLabourProfileName,
    profile?.selectedLabourProfile?.name,
    profile?.selectedLabourProfile?.staffName,
    profile?.linkedLabourProfile?.name,
    profile?.linkedLabourProfile?.staffName,
    profile?.inputs?.staffName,
    profile?.inputs?.profileName,
    profile?.results?.inputs?.staffName,
    profile?.results?.inputs?.profileName
  );
}

function getLinkedLabourProfileId(overheadProfile) {
  return normalizeId(
    text(
      overheadProfile?.linkedLabourProfileId,
      overheadProfile?.labourProfileId,
      overheadProfile?.selectedLabourProfileId,
      overheadProfile?.linkedProfileId,
      overheadProfile?.selectedLabourProfile?.id,
      overheadProfile?.selectedLabourProfile?.profileId,
      overheadProfile?.linkedLabourProfile?.id,
      overheadProfile?.linkedLabourProfile?.profileId,
      overheadProfile?.results?.linkedLabourProfileId,
      overheadProfile?.results?.labourProfileId,
      overheadProfile?.results?.selectedLabourProfileId,
      overheadProfile?.results?.inputs?.linkedLabourProfileId,
      overheadProfile?.results?.inputs?.labourProfileId
    )
  );
}

function getLinkedLabourProfileName(overheadProfile) {
  return text(
    overheadProfile?.linkedLabourProfileName,
    overheadProfile?.labourProfileName,
    overheadProfile?.selectedLabourProfileName,
    overheadProfile?.staffName,
    overheadProfile?.profileName,
    overheadProfile?.name,
    overheadProfile?.selectedLabourProfile?.name,
    overheadProfile?.selectedLabourProfile?.staffName,
    overheadProfile?.linkedLabourProfile?.name,
    overheadProfile?.linkedLabourProfile?.staffName,
    overheadProfile?.inputs?.staffName,
    overheadProfile?.inputs?.profileName,
    overheadProfile?.results?.inputs?.staffName,
    overheadProfile?.results?.inputs?.profileName
  );
}

function getProfileId(profile) {
  return normalizeId(
    text(
      profile?.id,
      profile?.profileId,
      profile?.uuid,
      profile?.results?.id,
      profile?.results?.profileId,
      profile?.inputs?.id,
      profile?.inputs?.profileId
    )
  );
}

function pickMatchingOverheadProfile(labourProfile, overheadProfiles) {
  const labourId = getProfileId(labourProfile);
  const labourName = normalizeText(getLabourName(labourProfile));
  const labourProfileName = normalizeText(getLabourProfileName(labourProfile));

  let directMatch = overheadProfiles.find((item) => {
    const linkedId = getLinkedLabourProfileId(item);
    return linkedId && labourId && linkedId === labourId;
  });
  if (directMatch) return directMatch;

  directMatch = overheadProfiles.find((item) => {
    const linkedName = normalizeText(getLinkedLabourProfileName(item));
    return (
      linkedName &&
      ((labourName && linkedName === labourName) ||
        (labourProfileName && linkedName === labourProfileName))
    );
  });
  if (directMatch) return directMatch;

  directMatch = overheadProfiles.find((item) => {
    const overheadName = normalizeText(getOverheadName(item));
    return (
      overheadName &&
      ((labourName && overheadName === labourName) ||
        (labourProfileName && overheadName === labourProfileName))
    );
  });
  if (directMatch) return directMatch;

  directMatch = overheadProfiles.find((item) => {
    const linkedName = normalizeText(getLinkedLabourProfileName(item));
    const overheadName = normalizeText(getOverheadName(item));

    return (
      (labourName &&
        ((linkedName && linkedName.includes(labourName)) ||
          (overheadName && overheadName.includes(labourName)))) ||
      (labourProfileName &&
        ((linkedName && linkedName.includes(labourProfileName)) ||
          (overheadName && overheadName.includes(labourProfileName))))
    );
  });

  return directMatch || null;
}

function buildPeriodValues({
  hourlyRevenue = 0,
  hourlyRealCost = 0,
  hourlyOverhead = 0,
  hourlyProfit = 0,
  annualRevenue = 0,
  annualRealCost = 0,
  annualOverhead = 0,
  annualProfit = 0,
}) {
  return {
    hourly: {
      revenue: hourlyRevenue,
      realCost: hourlyRealCost,
      overhead: hourlyOverhead,
      profit: hourlyProfit,
    },
    weekly: {
      revenue: annualRevenue / 52,
      realCost: annualRealCost / 52,
      overhead: annualOverhead / 52,
      profit: annualProfit / 52,
    },
    monthly: {
      revenue: annualRevenue / 12,
      realCost: annualRealCost / 12,
      overhead: annualOverhead / 12,
      profit: annualProfit / 12,
    },
    yearly: {
      revenue: annualRevenue,
      realCost: annualRealCost,
      overhead: annualOverhead,
      profit: annualProfit,
    },
  };
}

function getCommercialRowStatus(row) {
  if (!row.overheads?.linked) {
    return STATUS_CONFIG["missing-overhead"];
  }

  if ((row.profitPerHour || 0) < 0) {
    return STATUS_CONFIG["losing-money"];
  }

  if (
    (row.chargeoutRate || 0) < (row.targetRate || 0) ||
    (row.marginPct || 0) < (row.targetMarginPct || 0)
  ) {
    return STATUS_CONFIG["below-target"];
  }

  if ((row.productivityPct || 0) < LOW_PRODUCTIVITY_THRESHOLD) {
    return STATUS_CONFIG["low-productivity"];
  }

  return STATUS_CONFIG.healthy;
}

function getCommercialRowFlags(row) {
  const flags = [];

  if (!row.overheads?.linked) {
    flags.push({
      key: "missing-overhead",
      label: "No Overhead",
      tone: "warning",
    });
  }

  if ((row.profitPerHour || 0) < 0) {
    flags.push({
      key: "loss",
      label: "Loss",
      tone: "danger",
    });
  }

  if ((row.chargeoutRate || 0) < (row.targetRate || 0)) {
    flags.push({
      key: "rate-gap",
      label: "Below Target Rate",
      tone: "warning",
    });
  }

  if ((row.marginPct || 0) < (row.targetMarginPct || 0)) {
    flags.push({
      key: "margin-gap",
      label: "Below Margin",
      tone: "warning",
    });
  }

  if ((row.productivityPct || 0) < LOW_PRODUCTIVITY_THRESHOLD) {
    flags.push({
      key: "low-productivity",
      label: "Low Productivity",
      tone: "caution",
    });
  }

  if ((row.overheadPerHour || 0) > 0 && row.overheads?.linked) {
    flags.push({
      key: "overhead-linked",
      label: "Overhead Linked",
      tone: "healthy",
    });
  }

  return flags;
}

function getCommercialRowDisplay(row) {
  const status = getCommercialRowStatus(row);
  const flags = getCommercialRowFlags(row);

  return {
    ...row,
    status: status.tone,
    statusLabel: status.label,
    statusKey: status.key,
    statusSort: status.sort,
    flags,
  };
}

function sortCommercialRows(rows) {
  return [...rows].sort((a, b) => {
    if ((a.statusSort || 999) !== (b.statusSort || 999)) {
      return (a.statusSort || 999) - (b.statusSort || 999);
    }

    if ((a.annualProfit || 0) !== (b.annualProfit || 0)) {
      return (a.annualProfit || 0) - (b.annualProfit || 0);
    }

    return String(a.staffName || "").localeCompare(String(b.staffName || ""));
  });
}

export function loadCommercialPortfolioData() {
  return {
    labour: loadAllMatchingArrays(LABOUR_STORAGE_KEYS),
    overheads: loadAllMatchingArrays(OVERHEAD_STORAGE_KEYS),
  };
}

export function saveLabourProfilesToStorage(profiles = []) {
  if (typeof window === "undefined") return;

  const activeKey = detectStorageKey(
    LABOUR_STORAGE_KEYS,
    "qs-tools-labour-profiles"
  );

  window.localStorage.setItem(activeKey, JSON.stringify(profiles));
}

export function buildCommercialPortfolio(
  labourProfiles = [],
  overheadProfiles = []
) {
  const rawRows = labourProfiles.map((labourProfile, index) => {
    const overheadProfile = pickMatchingOverheadProfile(
      labourProfile,
      overheadProfiles
    );

    const recoveredHours = getRecoveredHours(labourProfile);
    const paidHours = getPaidHours(labourProfile);
    const productivityPct = getProductivityPct(
      labourProfile,
      recoveredHours,
      paidHours
    );

    const labourOnlyCostPerHour = getLoadedRealCostPerHour(labourProfile);
    const annualOverhead = overheadProfile
      ? getOverheadAnnual(overheadProfile)
      : 0;

    const overheadPerHour =
      recoveredHours > 0 ? annualOverhead / recoveredHours : 0;

    const realCostPerHour = labourOnlyCostPerHour + overheadPerHour;

    const chargeoutRate = getChargeoutRate(labourProfile);
    const targetMarginPct = getTargetMarginPct(labourProfile);

    const targetRate =
      targetMarginPct >= 100
        ? 0
        : realCostPerHour / (1 - targetMarginPct / 100);

    const profitPerHour = chargeoutRate - realCostPerHour;

    const marginPct =
      chargeoutRate > 0 ? (profitPerHour / chargeoutRate) * 100 : 0;

    const annualRevenue = chargeoutRate * recoveredHours;
    const annualRealCost = realCostPerHour * recoveredHours;
    const annualProfit = profitPerHour * recoveredHours;
    const rateGapToTarget = chargeoutRate - targetRate;

    const periodValues = buildPeriodValues({
      hourlyRevenue: chargeoutRate,
      hourlyRealCost: realCostPerHour,
      hourlyOverhead: overheadPerHour,
      hourlyProfit: profitPerHour,
      annualRevenue,
      annualRealCost,
      annualOverhead,
      annualProfit,
    });

    const baseRow = {
      id: getProfileId(labourProfile) || `profile-${index + 1}`,
      staffName: getLabourName(labourProfile),
      role: getLabourRole(labourProfile),
      labourProfileName: getLabourProfileName(labourProfile),
      overheadProfileName: overheadProfile ? getOverheadName(overheadProfile) : "",
      chargeoutRate,
      targetRate,
      rateGapToTarget,
      labourOnlyCostPerHour,
      realCostPerHour,
      profitPerHour,
      marginPct,
      targetMarginPct,
      productiveHours: recoveredHours,
      recoveredHours,
      paidHoursPerYear: paidHours,
      productivityPct,
      annualOverhead,
      overheadPerHour,
      overheads: {
        annual: annualOverhead,
        hourly: overheadPerHour,
        linked: !!overheadProfile,
      },
      annualRevenue,
      annualRealCost,
      annualProfit,
      periods: periodValues,
    };

    return getCommercialRowDisplay(baseRow);
  });

  const rows = sortCommercialRows(rawRows);

  const profileCount = rows.length;

  const totalRecoveredHours = rows.reduce(
    (sum, row) => sum + num(row.recoveredHours),
    0
  );

  const totalAnnualOverhead = rows.reduce(
    (sum, row) => sum + num(row.annualOverhead),
    0
  );

  const totalAnnualRevenue = rows.reduce(
    (sum, row) => sum + num(row.annualRevenue),
    0
  );

  const totalAnnualRealCost = rows.reduce(
    (sum, row) => sum + num(row.annualRealCost),
    0
  );

  const totalAnnualProfit = rows.reduce(
    (sum, row) => sum + num(row.annualProfit),
    0
  );

  const totalChargeoutPerHour =
    totalRecoveredHours > 0 ? totalAnnualRevenue / totalRecoveredHours : 0;

  const totalRealCostPerHour =
    totalRecoveredHours > 0 ? totalAnnualRealCost / totalRecoveredHours : 0;

  const totalProfitPerHour =
    totalRecoveredHours > 0 ? totalAnnualProfit / totalRecoveredHours : 0;

  const portfolioMarginPct =
    totalAnnualRevenue > 0
      ? (totalAnnualProfit / totalAnnualRevenue) * 100
      : 0;

  const portfolioAnnualMarginPct = portfolioMarginPct;

  const blendedChargeoutRate =
    totalRecoveredHours > 0 ? totalAnnualRevenue / totalRecoveredHours : 0;

  const blendedRealCostRate =
    totalRecoveredHours > 0 ? totalAnnualRealCost / totalRecoveredHours : 0;

  const blendedProfitPerHour =
    totalRecoveredHours > 0 ? totalAnnualProfit / totalRecoveredHours : 0;

  const avgTargetMarginPct =
    profileCount > 0
      ? rows.reduce((sum, row) => sum + num(row.targetMarginPct), 0) /
        profileCount
      : 0;

  const totalsPeriodValues = buildPeriodValues({
    hourlyRevenue: blendedChargeoutRate,
    hourlyRealCost: blendedRealCostRate,
    hourlyOverhead:
      totalRecoveredHours > 0 ? totalAnnualOverhead / totalRecoveredHours : 0,
    hourlyProfit: blendedProfitPerHour,
    annualRevenue: totalAnnualRevenue,
    annualRealCost: totalAnnualRealCost,
    annualOverhead: totalAnnualOverhead,
    annualProfit: totalAnnualProfit,
  });

  return {
    rows,
    totals: {
      profileCount,
      totalChargeoutPerHour,
      totalRealCostPerHour,
      totalProfitPerHour,
      totalAnnualOverhead,
      totalProductiveHours: totalRecoveredHours,
      totalRecoveredHours,
      totalAnnualRevenue,
      totalAnnualRealCost,
      totalAnnualProfit,
      portfolioMarginPct,
      portfolioAnnualMarginPct,
      blendedChargeoutRate,
      blendedRealCostRate,
      blendedProfitPerHour,
      avgTargetMarginPct,
      periods: totalsPeriodValues,
    },
  };
}