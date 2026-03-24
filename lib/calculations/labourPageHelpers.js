export const DEFAULT_FORM = {
  id: "",
  staffTag: "",
  staffName: "",
  role: "",
  taxCode: "M",
  baseHourlyRate: 35,
  hoursPerWeek: 40,
  chargeoutRate: 75,
  efficiencyPct: 80,
  kiwisaverPct: 3,
  employerKiwisaverPct: 3,
  includeEmployerKiwisaver: true,
  annualLeaveWeeks: 4,
  publicHolidays: 12,
  sickDays: 10,
  bereavementDays: 1,
  familyViolenceDays: 0,
  includeAnnualLeave: true,
  includePublicHolidays: true,
  includeSickLeave: true,
  includeBereavement: true,
  includeFamilyViolence: false,
  targetMarginPct: 20,
};

export function normaliseFormForCalculation(form) {
  return {
    ...form,
    baseHourlyRate: Number(form.baseHourlyRate || 0),
    hoursPerWeek: Number(form.hoursPerWeek || 0),
    chargeoutRate: Number(form.chargeoutRate || 0),
    efficiencyPct: Number(form.efficiencyPct || 0),
    kiwisaverPct: Number(form.kiwisaverPct || 0),
    employerKiwisaverPct: Number(form.employerKiwisaverPct || 0),
    annualLeaveWeeks: Number(form.annualLeaveWeeks || 0),
    publicHolidays: Number(form.publicHolidays || 0),
    sickDays: Number(form.sickDays || 0),
    bereavementDays: Number(form.bereavementDays || 0),
    familyViolenceDays: Number(form.familyViolenceDays || 0),
    targetMarginPct: Number(form.targetMarginPct || 0),
  };
}

export function safeDivide(numerator, denominator) {
  if (!denominator) return 0;
  return numerator / denominator;
}

export function calculateOverheadValues(form, totalAnnualOverhead) {
  const paidHoursPerYear = Number(form.hoursPerWeek || 0) * 52;

  const productiveHoursPerYear =
    paidHoursPerYear * (Number(form.efficiencyPct || 0) / 100);

  const overheadPerPaidHour = safeDivide(
    totalAnnualOverhead,
    paidHoursPerYear
  );

  const overheadPerProductiveHour = safeDivide(
    totalAnnualOverhead,
    productiveHoursPerYear
  );

  return {
    paidHoursPerYear,
    productiveHoursPerYear,
    overheadPerPaidHour,
    overheadPerProductiveHour,
  };
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-NZ", {
    style: "currency",
    currency: "NZD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}