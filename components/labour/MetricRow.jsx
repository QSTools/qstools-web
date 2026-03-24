"use client";

import { valueClass } from "@/lib/utils/classHelpers";

export default function MetricRow({
  label,
  value,
  rawValue = null,
  strong = false,
  className = "",
}) {
  const numeric = rawValue ?? value;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 overflow-visible py-2">
      <div className="relative min-w-0 overflow-visible text-sm text-muted-foreground">
        {label}
      </div>
      <span
        className={`shrink-0 text-sm ${valueClass(numeric, strong)} ${className}`}
      >
        {value}
      </span>
    </div>
  );
}