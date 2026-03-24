export function toNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

export function toAnnual(amount, frequency) {
  const numericAmount = toNumber(amount);

  if (frequency === "weekly") return numericAmount * 52;
  if (frequency === "monthly") return numericAmount * 12;
  return numericAmount;
}

export function safeDivide(numerator, denominator) {
  if (!denominator) return 0;
  return numerator / denominator;
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-NZ", {
    style: "currency",
    currency: "NZD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

export function calculateGeneralOverheads(form, overheadItems) {
  const rowSummaries = overheadItems.map((item) => {
    const enabled = Boolean(form[`${item.key}Enabled`]);
    const frequency = form[`${item.key}Frequency`];
    const amount = form[`${item.key}Amount`];
    const annualAmount = enabled ? toAnnual(amount, frequency) : 0;

    return {
      ...item,
      enabled,
      frequency,
      amount,
      annualAmount,
    };
  });

  const generalAnnualOverhead = rowSummaries.reduce(
    (sum, item) => sum + item.annualAmount,
    0
  );

  return {
    rowSummaries,
    generalAnnualOverhead,
  };
}

export function calculateRecoveryHours({
  labourProfile,
  recoveryBasis,
}) {
  const hoursPerWeek = toNumber(labourProfile?.hoursPerWeek);
  const efficiencyPct = toNumber(labourProfile?.efficiencyPct);

  const paidHoursPerYear = hoursPerWeek * 52;
  const productiveHoursPerYear =
    paidHoursPerYear * (efficiencyPct > 0 ? efficiencyPct / 100 : 0);

  const selectedRecoveryHours =
    recoveryBasis === "paid" ? paidHoursPerYear : productiveHoursPerYear;

  return {
    hoursPerWeek,
    efficiencyPct,
    paidHoursPerYear,
    productiveHoursPerYear,
    selectedRecoveryHours,
  };
}

export function calculateVehicleCosts(form, labourProfile) {
  const vehicleEnabled = Boolean(form.vehicleEnabled);
  const vehicleType = form.vehicleType || "company";
  const vehicleRecoveryBasis = form.vehicleRecoveryBasis || "productive";
  const includeVehicleReplacementAllowance = Boolean(
    form.includeVehicleReplacementAllowance
  );

  const recoveryHours = calculateRecoveryHours({
    labourProfile,
    recoveryBasis: vehicleRecoveryBasis,
  });

  if (!vehicleEnabled) {
    return {
      vehicleEnabled,
      vehicleType,
      vehicleRecoveryBasis,
      includeVehicleReplacementAllowance,
      ...recoveryHours,
      depreciationAnnual: 0,
      replacementAllowanceAnnual: 0,
      interestAnnual: 0,
      cashVehicleAnnualCost: 0,
      vehicleLineItems: [],
      vehicleAnnualCost: 0,
      vehicleCostPerHour: 0,
    };
  }

  let depreciationAnnual = 0;
  let replacementAllowanceAnnual = 0;
  let interestAnnual = 0;
  let cashVehicleAnnualCost = 0;
  let vehicleLineItems = [];
  let vehicleAnnualCost = 0;

  if (vehicleType === "company") {
    const purchasePrice = toNumber(form.vehiclePurchasePrice);
    const residualValue = toNumber(form.vehicleResidualValue);
    const usefulLifeYears = toNumber(form.vehicleUsefulLifeYears);
    const loanAmount = toNumber(form.vehicleLoanAmount);
    const interestRate = toNumber(form.vehicleInterestRate);

    const insurance = toNumber(form.vehicleInsurance);
    const rego = toNumber(form.vehicleRego);
    const cofWof = toNumber(form.vehicleCofWof);
    const ruc = toNumber(form.vehicleRuc);
    const fuel = toNumber(form.vehicleFuel);
    const maintenance = toNumber(form.vehicleMaintenance);
    const tyresRepairs = toNumber(form.vehicleTyresRepairs);

    depreciationAnnual =
      usefulLifeYears > 0
        ? Math.max(0, purchasePrice - residualValue) / usefulLifeYears
        : 0;

    replacementAllowanceAnnual = depreciationAnnual;
    interestAnnual = loanAmount * (interestRate / 100);

    vehicleLineItems = [
      { label: "Interest", value: interestAnnual, isCash: true },
      { label: "Fuel", value: fuel, isCash: true },
      { label: "Maintenance", value: maintenance, isCash: true },
      { label: "Tyres / Repairs", value: tyresRepairs, isCash: true },
      { label: "Insurance", value: insurance, isCash: true },
      { label: "Rego", value: rego, isCash: true },
      { label: "COF / WOF", value: cofWof, isCash: true },
      { label: "RUC / Diesel Mileage", value: ruc, isCash: true },
    ];

    if (includeVehicleReplacementAllowance) {
      vehicleLineItems.unshift({
        label: "Replacement Allowance",
        value: replacementAllowanceAnnual,
        isCash: false,
      });
    }

    cashVehicleAnnualCost =
      interestAnnual +
      fuel +
      maintenance +
      tyresRepairs +
      insurance +
      rego +
      cofWof +
      ruc;

    vehicleAnnualCost =
      cashVehicleAnnualCost +
      (includeVehicleReplacementAllowance ? replacementAllowanceAnnual : 0);
  } else {
    const fuel = toNumber(form.fuelOnlyFuel);
    const allowance = toNumber(form.fuelOnlyAllowance);
    const maintenanceContribution = toNumber(
      form.fuelOnlyMaintenanceContribution
    );

    vehicleLineItems = [
      { label: "Fuel", value: fuel, isCash: true },
      { label: "Vehicle Allowance", value: allowance, isCash: true },
      { label: "Maintenance Contribution", value: maintenanceContribution, isCash: true },
    ];

    cashVehicleAnnualCost = vehicleLineItems.reduce(
      (sum, item) => sum + item.value,
      0
    );

    vehicleAnnualCost = cashVehicleAnnualCost;
  }

  const vehicleCostPerHour = safeDivide(
    vehicleAnnualCost,
    recoveryHours.selectedRecoveryHours
  );

  return {
    vehicleEnabled,
    vehicleType,
    vehicleRecoveryBasis,
    includeVehicleReplacementAllowance,
    ...recoveryHours,
    depreciationAnnual,
    replacementAllowanceAnnual,
    interestAnnual,
    cashVehicleAnnualCost,
    vehicleLineItems,
    vehicleAnnualCost,
    vehicleCostPerHour,
  };
}

export function calculateOverheadSummary({
  form,
  labourProfile,
  overheadItems,
}) {
  const { rowSummaries, generalAnnualOverhead } = calculateGeneralOverheads(
    form,
    overheadItems
  );

  const vehicle = calculateVehicleCosts(form, labourProfile);

  const totalAnnualOverhead =
    generalAnnualOverhead + vehicle.vehicleAnnualCost;

  const totalOverheadPerHour = safeDivide(
    totalAnnualOverhead,
    vehicle.selectedRecoveryHours
  );

  const generalPct =
    safeDivide(generalAnnualOverhead, totalAnnualOverhead) * 100;
  const vehiclePct =
    safeDivide(vehicle.vehicleAnnualCost, totalAnnualOverhead) * 100;

  return {
    rowSummaries,
    generalAnnualOverhead,
    vehicle,
    totalAnnualOverhead,
    totalOverheadPerHour,
    generalPct,
    vehiclePct,
  };
}