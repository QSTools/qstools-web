import { NZ_LEAVE_DEFAULTS } from "../config/nzLeaveDefaults";
import { ESCT_BRACKETS } from "../config/nzTaxRates";
import { calculatePAYEAnnual } from "./payeNz";

function num(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function round2(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

function getEsctRate(annualIncome) {
  const income = Number(annualIncome) || 0;

  if (!Array.isArray(ESCT_BRACKETS) || ESCT_BRACKETS.length === 0) {
    return 0;
  }

  for (const band of ESCT_BRACKETS) {
    if (income <= band.upTo) {
      return band.rate;
    }
  }

  return ESCT_BRACKETS[ESCT_BRACKETS.length - 1].rate;
}

function buildLabourFlags({
  effectiveRecoveredCostPerHour,
  targetRate,
  chargeoutRate,
  marginPct,
  targetMarginPct,
  efficiencyPctRaw,
  nonProductivePaidHours,
  paidHoursPerYear,
  loadedHourlyCost,
}) {
  const flags = [];

  const costRatio =
    chargeoutRate > 0 ? effectiveRecoveredCostPerHour / chargeoutRate : 0;

  const leaveBurden =
    paidHoursPerYear > 0 ? nonProductivePaidHours / paidHoursPerYear : 0;

  const roundedChargeout = Number((chargeoutRate ?? 0).toFixed(2));
  const roundedCost = Number((effectiveRecoveredCostPerHour ?? 0).toFixed(2));
  const roundedTarget = Number((targetRate ?? 0).toFixed(2));

  if (roundedChargeout < roundedCost) {
    flags.push({ type: "danger", label: "Below Cost Recovery" });
  } else if (roundedChargeout === roundedCost) {
    flags.push({ type: "healthy", label: "Meets Cost Recovery" });
  }

  if (roundedChargeout < roundedTarget) {
    flags.push({ type: "warning", label: "Below Target Rate" });
  } else if (roundedChargeout === roundedTarget) {
    flags.push({ type: "healthy", label: "Meets Target Rate" });
  }

  if (roundedChargeout < roundedTarget && marginPct < targetMarginPct) {
    flags.push({ type: "warning", label: "Below Target Margin" });
  }

  if (efficiencyPctRaw < 70) {
    flags.push({ type: "warning", label: "Low Efficiency" });
  }

  if (
    roundedChargeout > roundedCost &&
    roundedChargeout < roundedTarget &&
    costRatio > 0.8
  ) {
    flags.push({ type: "caution", label: "High Cost Ratio" });
  }

  if (leaveBurden > 0.25) {
    flags.push({ type: "warning", label: "High Leave Burden" });
  }

  if (roundedChargeout < loadedHourlyCost * 1.15) {
    flags.push({ type: "caution", label: "Weak Charge-Out Buffer" });
  }

  return flags;
}

function buildMarginTier(marginPct, targetMarginPct) {
  if (marginPct < 0) return "danger";
  if (marginPct < targetMarginPct) return "warning";
  return "healthy";
}

export function calculateLabourRate(input = {}) {
  const staffTag = String(input.staffTag || "").trim();
  const staffName = String(input.staffName || "").trim();
  const role = String(input.role || "").trim();

  const baseHourlyRate = num(input.baseHourlyRate);
  const hoursPerWeek = num(input.hoursPerWeek, 40);
  const chargeoutRate = num(input.chargeoutRate);
  const overheadPerHour = num(input.overheadPerHour, 0);

  const efficiencyPctRaw = num(input.efficiencyPct, 80);
  const efficiencyPct = Math.max(0.01, efficiencyPctRaw / 100);

  const targetMarginPctRaw = num(input.targetMarginPct, 20);
  const targetMarginPct = Math.min(Math.max(targetMarginPctRaw, 0), 95);
  const targetMarginDecimal = targetMarginPct / 100;

  const kiwisaverPct = num(input.kiwisaverPct, 3) / 100;
  const employerKiwisaverPct = num(input.employerKiwisaverPct, 3) / 100;
  const includeEmployerKiwisaver = input.includeEmployerKiwisaver ?? true;

  const taxCode = input.taxCode || "M";

  const includeAnnualLeave = input.includeAnnualLeave ?? true;
  const includePublicHolidays = input.includePublicHolidays ?? true;
  const includeSickLeave = input.includeSickLeave ?? true;
  const includeBereavement = input.includeBereavement ?? true;
  const includeFamilyViolence = input.includeFamilyViolence ?? false;

  const annualLeaveWeeks = num(
    input.annualLeaveWeeks,
    NZ_LEAVE_DEFAULTS.annualLeaveWeeks
  );
  const publicHolidays = num(
    input.publicHolidays,
    NZ_LEAVE_DEFAULTS.publicHolidays
  );
  const sickDays = num(input.sickDays, NZ_LEAVE_DEFAULTS.sickDays);
  const bereavementDays = num(
    input.bereavementDays,
    NZ_LEAVE_DEFAULTS.bereavementDays
  );
  const familyViolenceDays = num(
    input.familyViolenceDays,
    NZ_LEAVE_DEFAULTS.familyViolenceDays
  );

  const weeksPerYear = NZ_LEAVE_DEFAULTS.weeksPerYear;
  const daysPerWeek = 5;
  const hoursPerDay = hoursPerWeek / daysPerWeek;

  const grossHourly = baseHourlyRate;
  const grossWeekly = grossHourly * hoursPerWeek;
  const grossAnnual = grossWeekly * weeksPerYear;

  const annualLeaveHours = includeAnnualLeave
    ? annualLeaveWeeks * hoursPerWeek
    : 0;

  const publicHolidayHours = includePublicHolidays
    ? publicHolidays * hoursPerDay
    : 0;

  const sickLeaveHours = includeSickLeave ? sickDays * hoursPerDay : 0;

  const bereavementHours = includeBereavement
    ? bereavementDays * hoursPerDay
    : 0;

  const familyViolenceHours = includeFamilyViolence
    ? familyViolenceDays * hoursPerDay
    : 0;

  const paidHoursPerYear = hoursPerWeek * weeksPerYear;

  const nonProductivePaidHours =
    annualLeaveHours +
    publicHolidayHours +
    sickLeaveHours +
    bereavementHours +
    familyViolenceHours;

  const productiveHoursPerYear = Math.max(
    paidHoursPerYear - nonProductivePaidHours,
    0
  );

  const employerKiwisaverGross = includeEmployerKiwisaver
    ? grossAnnual * employerKiwisaverPct
    : 0;

  const esctRate = includeEmployerKiwisaver ? getEsctRate(grossAnnual) : 0;
  const esctAmount = employerKiwisaverGross * esctRate;

  const employerKiwisaverTotalCost = employerKiwisaverGross + esctAmount;
  const totalEmploymentCost = grossAnnual + employerKiwisaverTotalCost;

  const loadedHourlyCost =
    productiveHoursPerYear > 0
      ? totalEmploymentCost / productiveHoursPerYear
      : 0;

  const effectiveRecoveredCostPerHourBeforeOverheads =
    efficiencyPct > 0 ? loadedHourlyCost / efficiencyPct : 0;

  const effectiveRecoveredCostPerHour =
    effectiveRecoveredCostPerHourBeforeOverheads + overheadPerHour;

  const targetRate =
    targetMarginDecimal < 1
      ? effectiveRecoveredCostPerHour / (1 - targetMarginDecimal)
      : 0;

  const rateGapToTarget = chargeoutRate - targetRate;

  const paye = calculatePAYEAnnual(grossAnnual, kiwisaverPct);

  const recoveredHoursPerYear = productiveHoursPerYear * efficiencyPct;

  const annualRevenue = chargeoutRate * recoveredHoursPerYear;
  const annualRecoveredCost =
    effectiveRecoveredCostPerHour * recoveredHoursPerYear;

  const profitPerRecoveredHour =
    chargeoutRate - effectiveRecoveredCostPerHour;

  const profitPerDay = profitPerRecoveredHour * hoursPerDay;
  const profitPerWeek = profitPerRecoveredHour * hoursPerWeek;
  const profitPerYear = annualRevenue - annualRecoveredCost;

  const marginPct =
    chargeoutRate > 0 ? profitPerRecoveredHour / chargeoutRate : 0;

  const markupPct =
    effectiveRecoveredCostPerHour > 0
      ? profitPerRecoveredHour / effectiveRecoveredCostPerHour
      : 0;

  const marginPctDisplay = round2(marginPct * 100);
  const markupPctDisplay = round2(markupPct * 100);

  const flags = buildLabourFlags({
    effectiveRecoveredCostPerHour,
    targetRate,
    chargeoutRate,
    marginPct: marginPctDisplay,
    targetMarginPct,
    efficiencyPctRaw,
    nonProductivePaidHours,
    paidHoursPerYear,
    loadedHourlyCost,
  });

  const marginTier = buildMarginTier(marginPctDisplay, targetMarginPct);

  return {
    staffTag,
    staffName,
    role,
    inputs: {
      baseHourlyRate: round2(baseHourlyRate),
      hoursPerWeek: round2(hoursPerWeek),
      chargeoutRate: round2(chargeoutRate),
      efficiencyPct: round2(efficiencyPctRaw),
      targetMarginPct: round2(targetMarginPct),
      kiwisaverPct: round2(kiwisaverPct * 100),
      employerKiwisaverPct: round2(employerKiwisaverPct * 100),
      includeEmployerKiwisaver,
      taxCode,
      overheadPerHour: round2(overheadPerHour),
    },
    gross: {
      hourly: round2(grossHourly),
      weekly: round2(grossWeekly),
      annual: round2(grossAnnual),
    },
    leave: {
      annualLeaveHours: round2(annualLeaveHours),
      publicHolidayHours: round2(publicHolidayHours),
      sickLeaveHours: round2(sickLeaveHours),
      bereavementHours: round2(bereavementHours),
      familyViolenceHours: round2(familyViolenceHours),
      nonProductivePaidHours: round2(nonProductivePaidHours),
      paidHoursPerYear: round2(paidHoursPerYear),
      productiveHoursPerYear: round2(productiveHoursPerYear),
      recoveredHoursPerYear: round2(recoveredHoursPerYear),
    },
    paye: {
      ...paye,
      grossHourly: round2(grossHourly),
      grossWeekly: round2(grossWeekly),
      netHourly:
        paidHoursPerYear > 0 ? round2(paye.netAnnual / paidHoursPerYear) : 0,
    },
    employer: {
      employerKiwisaverGross: round2(employerKiwisaverGross),
      esctRate: round2(esctRate * 100),
      esctAmount: round2(esctAmount),
      employerKiwisaverTotalCost: round2(employerKiwisaverTotalCost),
      totalEmploymentCost: round2(totalEmploymentCost),
    },
    loaded: {
      hourly: round2(loadedHourlyCost),
      daily: round2(loadedHourlyCost * hoursPerDay),
      effectiveRecoveredCostPerHourBeforeOverheads: round2(
        effectiveRecoveredCostPerHourBeforeOverheads
      ),
      overheadPerHour: round2(overheadPerHour),
      effectiveRecoveredCostPerHour: round2(effectiveRecoveredCostPerHour),
      targetRate: round2(targetRate),
      rateGapToTarget: round2(rateGapToTarget),
    },
    profit: {
      chargeoutRate: round2(chargeoutRate),
      profitPerHour: round2(profitPerRecoveredHour),
      profitPerDay: round2(profitPerDay),
      profitPerWeek: round2(profitPerWeek),
      profitPerYear: round2(profitPerYear),
      annualRevenue: round2(annualRevenue),
      annualRecoveredCost: round2(annualRecoveredCost),
      marginPct: marginPctDisplay,
      markupPct: markupPctDisplay,
      targetMarginPct: round2(targetMarginPct),
    },
    status: {
      flags,
      marginTier,
    },
  };
}