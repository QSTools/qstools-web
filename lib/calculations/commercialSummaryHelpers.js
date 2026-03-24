function toNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function round2(value) {
  return Math.round((toNumber(value, 0) + Number.EPSILON) * 100) / 100;
}

function safeDivide(numerator, denominator, fallback = 0) {
  const n = toNumber(numerator, 0);
  const d = toNumber(denominator, 0);
  if (!d) return fallback;
  return n / d;
}

function buildPeriodValues(hourlyValue, hoursPerYear) {
  const hourly = toNumber(hourlyValue, 0);
  const yearlyHours = toNumber(hoursPerYear, 0);

  const yearly = hourly * yearlyHours;
  const weekly = yearly / 52;
  const monthly = yearly / 12;

  return {
    hourly: round2(hourly),
    weekly: round2(weekly),
    monthly: round2(monthly),
    yearly: round2(yearly),
  };
}

function getStatusTier({
  chargeoutRate,
  trueCostPerHour,
  marginPct,
  targetMarginPct,
}) {
  if (chargeoutRate < trueCostPerHour) return "danger";
  if (marginPct < targetMarginPct) return "warning";
  if (marginPct < targetMarginPct + 5) return "caution";
  return "healthy";
}

function buildFlags({
  chargeoutRate,
  trueCostPerHour,
  profitPerHour,
  marginPct,
  targetMarginPct,
  overheadPerHour,
  loadedLabourCostPerHour,
}) {
  const flags = [];

  if (chargeoutRate < trueCostPerHour) {
    flags.push({
      type: "danger",
      label: "Losing money",
      message: "Charge-out rate is below the true recovered cost per hour.",
    });
  }

  if (profitPerHour <= 0) {
    flags.push({
      type: "danger",
      label: "No profit buffer",
      message:
        "There is no commercial buffer after labour and overhead recovery.",
    });
  }

  if (marginPct < targetMarginPct) {
    flags.push({
      type: "warning",
      label: "Below target margin",
      message: "Current margin is below the selected target margin.",
    });
  }

  if (
    loadedLabourCostPerHour > 0 &&
    safeDivide(overheadPerHour, loadedLabourCostPerHour, 0) >= 0.5
  ) {
    flags.push({
      type: "caution",
      label: "High overhead load",
      message: "Overhead per hour is a high proportion of loaded labour cost.",
    });
  }

  if (
    chargeoutRate >= trueCostPerHour &&
    profitPerHour > 0 &&
    marginPct >= targetMarginPct
  ) {
    flags.push({
      type: "healthy",
      label: "Commercially healthy",
      message:
        "Rate is recovering labour and overhead and meeting the target margin.",
    });
  }

  return flags;
}

export function calculateCommercialSummary({
  results = {},
  overheadPerProductiveHour = 0,
} = {}) {
  // OPTION B:
  // results are labour-only
  // overhead is applied here at commercial-summary time
  const recoveredLabourBeforeOverheads = round2(
    results?.loaded?.effectiveRecoveredCostPerHourBeforeOverheads ||
      results?.loaded?.effectiveRecoveredCostPerHour ||
      0
  );

  const overheadPerHour = round2(overheadPerProductiveHour || 0);

  const trueCostPerHour = round2(
    recoveredLabourBeforeOverheads + overheadPerHour
  );

  const chargeoutRate = round2(
    results?.profit?.chargeoutRate || results?.inputs?.chargeoutRate || 0
  );

  const targetMarginPct = round2(
    results?.profit?.targetMarginPct || results?.inputs?.targetMarginPct || 0
  );

  const targetRate = round2(
    targetMarginPct >= 100
      ? 0
      : safeDivide(trueCostPerHour, 1 - targetMarginPct / 100, 0)
  );

  const profitPerHour = round2(chargeoutRate - trueCostPerHour);

  const marginPct = round2(
    chargeoutRate > 0 ? (profitPerHour / chargeoutRate) * 100 : 0
  );

  const markupPct = round2(
    trueCostPerHour > 0 ? (profitPerHour / trueCostPerHour) * 100 : 0
  );

  const recoveredHoursPerYear = round2(
    results?.leave?.recoveredHoursPerYear || 0
  );

  const recoveryGap = round2(chargeoutRate - trueCostPerHour);
  const rateGapToTarget = round2(chargeoutRate - targetRate);

  const periods = {
    loadedLabour: buildPeriodValues(
      recoveredLabourBeforeOverheads,
      recoveredHoursPerYear
    ),
    overhead: buildPeriodValues(overheadPerHour, recoveredHoursPerYear),
    trueCost: buildPeriodValues(trueCostPerHour, recoveredHoursPerYear),
    chargeout: buildPeriodValues(chargeoutRate, recoveredHoursPerYear),
    profit: buildPeriodValues(profitPerHour, recoveredHoursPerYear),
    targetRate: buildPeriodValues(targetRate, recoveredHoursPerYear),
    recoveryGap: buildPeriodValues(recoveryGap, recoveredHoursPerYear),
    rateGapToTarget: buildPeriodValues(rateGapToTarget, recoveredHoursPerYear),
  };

  const tier = getStatusTier({
    chargeoutRate,
    trueCostPerHour,
    marginPct,
    targetMarginPct,
  });

  const flags = buildFlags({
    chargeoutRate,
    trueCostPerHour,
    profitPerHour,
    marginPct,
    targetMarginPct,
    overheadPerHour,
    loadedLabourCostPerHour: recoveredLabourBeforeOverheads,
  });

  return {
    basis: {
      recoveredHoursPerYear,
    },

    percentages: {
      marginPct,
      markupPct,
      targetMarginPct,
    },

    summary: {
      loadedLabourCostPerHour: recoveredLabourBeforeOverheads,
      overheadPerHour,
      trueCostPerHour,
      chargeoutRate,
      profitPerHour,
      targetRate,
      rateGapToTarget,
      recoveryGap,
    },

    periods: {
      hourly: {
        loadedLabour: periods.loadedLabour.hourly,
        overhead: periods.overhead.hourly,
        trueCost: periods.trueCost.hourly,
        chargeout: periods.chargeout.hourly,
        profit: periods.profit.hourly,
        targetRate: periods.targetRate.hourly,
        recoveryGap: periods.recoveryGap.hourly,
        rateGapToTarget: periods.rateGapToTarget.hourly,
      },
      weekly: {
        loadedLabour: periods.loadedLabour.weekly,
        overhead: periods.overhead.weekly,
        trueCost: periods.trueCost.weekly,
        chargeout: periods.chargeout.weekly,
        profit: periods.profit.weekly,
        targetRate: periods.targetRate.weekly,
        recoveryGap: periods.recoveryGap.weekly,
        rateGapToTarget: periods.rateGapToTarget.weekly,
      },
      monthly: {
        loadedLabour: periods.loadedLabour.monthly,
        overhead: periods.overhead.monthly,
        trueCost: periods.trueCost.monthly,
        chargeout: periods.chargeout.monthly,
        profit: periods.profit.monthly,
        targetRate: periods.targetRate.monthly,
        recoveryGap: periods.recoveryGap.monthly,
        rateGapToTarget: periods.rateGapToTarget.monthly,
      },
      yearly: {
        loadedLabour: periods.loadedLabour.yearly,
        overhead: periods.overhead.yearly,
        trueCost: periods.trueCost.yearly,
        chargeout: periods.chargeout.yearly,
        profit: periods.profit.yearly,
        targetRate: periods.targetRate.yearly,
        recoveryGap: periods.recoveryGap.yearly,
        rateGapToTarget: periods.rateGapToTarget.yearly,
      },
    },

    status: {
      tier,
      flags,
      isProfitable: profitPerHour > 0,
      meetsTargetRate: chargeoutRate >= targetRate,
      meetsTargetMargin: marginPct >= targetMarginPct,
    },
  };
}

export default calculateCommercialSummary;