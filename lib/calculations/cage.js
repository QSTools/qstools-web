export function calculateCage({
  radius,
  length,
  quantity,
  qBars,
  tieCenters,
  sideCoverMm,
  topBottomCoverMm,
  hookAllowance,
}) {
  const pileDiameterMm = radius * 2 * 1000;
  const cageDiameterMm = Math.max(pileDiameterMm - sideCoverMm * 2, 0);
  const cageRadiusM = cageDiameterMm / 2000;
  const cageCircumferenceM = 2 * Math.PI * cageRadiusM;
  const effectiveCageLengthM = Math.max(length - (topBottomCoverMm * 2) / 1000, 0);
  const turnsPerCage = tieCenters > 0 ? effectiveCageLengthM / tieCenters : 0;

  const spiralLengthPerCage =
    Math.sqrt(Math.pow(cageCircumferenceM, 2) + Math.pow(tieCenters, 2)) *
    turnsPerCage;

  const verticalBarLengthEach = effectiveCageLengthM + hookAllowance;
  const totalVerticalBarLength = verticalBarLengthEach * qBars * quantity;
  const totalSpiralLength = spiralLengthPerCage * quantity;

  return {
    pileDiameterMm,
    cageDiameterMm,
    effectiveCageLengthM,
    spiralLengthPerCage,
    verticalBarLengthEach,
    totalVerticalBarLength,
    totalSpiralLength,
  };
}