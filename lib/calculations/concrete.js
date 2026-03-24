import { roundUpToStep } from "./helpers";

export function getConcreteDescription(mpa, mix) {
  return `${mpa}mPa ${mix}`;
}

export function calculateConcrete({
  radius,
  length,
  quantity,
  wastePct,
  vibrationPct,
}) {
  const pileVolumeEach = Math.PI * radius * radius * length;
  const baseConcrete = pileVolumeEach * quantity;
  const concreteWithWaste = baseConcrete * (1 + wastePct);
  const concreteWithAllAllowances = concreteWithWaste * (1 + vibrationPct);
  const roundedConcreteOrder = roundUpToStep(concreteWithAllAllowances, 0.2);

  return {
    pileVolumeEach,
    baseConcrete,
    concreteWithWaste,
    concreteWithAllAllowances,
    roundedConcreteOrder,
  };
}