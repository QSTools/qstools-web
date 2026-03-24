import { getConcreteDescription } from "../calculations/concrete";

export function buildPilingOutput({
  mpa,
  mix,
  roundedConcreteOrder,
  pumpRows,
  hasSmallLoadCharge,
  cylinderTesting,
  pilesCages,
  reinforcingDescription,
  quantity,
  steelType,
  tieType,
  totalVerticalBarLength,
  totalSpiralLength,
}) {
  const rows = [
    {
      description: getConcreteDescription(mpa, mix),
      qty: Number(roundedConcreteOrder.toFixed(1)),
      unit: "m³",
    },
    ...pumpRows,
  ];

  if (hasSmallLoadCharge) {
    rows.push({
      description: "Small Load Charge",
      qty: 1,
      unit: "Item",
    });
  }

  if (cylinderTesting) {
    rows.push({
      description: "Cylinder Testing",
      qty: 1,
      unit: "Item",
    });
  }

  if (pilesCages) {
    rows.push(
      {
        description: reinforcingDescription,
        qty: quantity,
        unit: "No.",
      },
      {
        description: `${steelType} Vertical Bars`,
        qty: Number(totalVerticalBarLength.toFixed(2)),
        unit: "lm",
      },
      {
        description: `${tieType} Spiral`,
        qty: Number(totalSpiralLength.toFixed(2)),
        unit: "lm",
      }
    );
  }

  return rows;
}