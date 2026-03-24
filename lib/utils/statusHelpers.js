export function statusIcon(label) {
  switch (label) {
    case "pass":
      return "✅";
    case "warn":
      return "⚠️";
    case "fail":
      return "⛔";
    default:
      return "•";
  }
}