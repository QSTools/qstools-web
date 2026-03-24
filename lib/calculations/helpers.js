export function num(value, fallback = 0) {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : fallback;
}

export function round(value, dp = 3) {
  return Number(value.toFixed(dp));
}

export function roundUpToStep(value, step) {
  if (!Number.isFinite(value) || step <= 0) return 0;
  return Math.ceil(value / step) * step;
}