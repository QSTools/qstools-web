export function money(value) {
  return new Intl.NumberFormat("en-NZ", {
    style: "currency",
    currency: "NZD",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

export function number(value) {
  return new Intl.NumberFormat("en-NZ", {
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

export function percent(value) {
  return `${number(value)}%`;
}