import { NZ_TAX } from "../config/nzTaxRates";

function round2(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

export function calculatePAYEAnnual(annualIncome, kiwisaverPct = 0) {
  const income = Number(annualIncome) || 0;
  const ksPct = Number(kiwisaverPct) || 0;

  const { brackets, acc } = NZ_TAX;

  let incomeTax = 0;
  let remaining = income;
  let lowerLimit = 0;

  for (const band of brackets) {
    const upperLimit = band.upTo;
    const taxableInBand = Math.min(remaining, upperLimit - lowerLimit);

    if (taxableInBand <= 0) break;

    incomeTax += taxableInBand * band.rate;
    remaining -= taxableInBand;
    lowerLimit = upperLimit;
  }

  const accLevy = Math.min(income, acc.cap) * acc.rate;
  const kiwisaverEmployee = income * ksPct;
  const totalDeductions = incomeTax + accLevy + kiwisaverEmployee;
  const netAnnual = income - totalDeductions;

  return {
    annualIncome: round2(income),
    incomeTax: round2(incomeTax),
    accLevy: round2(accLevy),
    kiwisaverEmployee: round2(kiwisaverEmployee),
    totalDeductions: round2(totalDeductions),
    netAnnual: round2(netAnnual),
    grossMonthly: round2(income / 12),
    grossWeekly: round2(income / 52),
    netMonthly: round2(netAnnual / 12),
    netWeekly: round2(netAnnual / 52),
  };
}