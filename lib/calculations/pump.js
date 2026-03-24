import { PUMP_RULES } from "../config/options";

export function getPumpRule(pumpType) {
  return PUMP_RULES[pumpType] || PUMP_RULES["No Pump"];
}

export function calculatePumpRows({ pumpType, concreteQty }) {
  const rule = getPumpRule(pumpType);

  if (!rule.rateM3PerHour) {
    return {
      mix: rule.mix,
      hours: 0,
      rows: [],
    };
  }

  const hours = concreteQty / rule.rateM3PerHour;

  return {
    mix: rule.mix,
    hours,
    rows: [
      {
        description: rule.establishmentLabel,
        qty: 1,
        unit: "Each",
      },
      {
        description: rule.hourlyLabel,
        qty: Number(hours.toFixed(2)),
        unit: "hrly",
      },
      {
        description: rule.perM3Label,
        qty: Number(concreteQty.toFixed(1)),
        unit: "m3",
      },
    ],
  };
}