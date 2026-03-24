export function valueClass(value, strong = false) {
  const numeric = Number(value || 0);

  if (numeric < 0) return "font-bold text-red-600";
  if (numeric > 0 && strong) return "font-bold text-green-600";

  return strong
    ? "font-semibold text-foreground"
    : "font-medium text-foreground";
}

export function marginClass(tier) {
  switch (tier) {
    case "danger":
      return "font-bold text-red-600";
    case "warning":
      return "font-bold text-orange-600";
    case "caution":
      return "font-bold text-yellow-600";
    case "healthy":
      return "font-bold text-green-600";
    default:
      return "font-medium text-foreground";
  }
}

export function flagClasses(type) {
  switch (type) {
    case "danger":
      return "border-red-300 bg-red-50 text-red-700";
    case "warning":
      return "border-orange-300 bg-orange-50 text-orange-700";
    case "caution":
      return "border-yellow-300 bg-yellow-50 text-yellow-700";
    case "healthy":
      return "border-green-300 bg-green-50 text-green-700";
    default:
      return "border-border bg-muted text-foreground";
  }
}

export function statusToneClasses(tone) {
  switch (tone) {
    case "danger":
      return "border-red-300 bg-red-50 text-red-700";
    case "warning":
      return "border-orange-300 bg-orange-50 text-orange-700";
    case "caution":
      return "border-yellow-300 bg-yellow-50 text-yellow-700";
    case "healthy":
      return "border-green-300 bg-green-50 text-green-700";
    default:
      return "border-border bg-muted text-foreground";
  }
}