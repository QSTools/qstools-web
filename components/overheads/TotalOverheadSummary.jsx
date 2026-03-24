"use client";

import { formatCurrency } from "@/lib/calculations/overheadCalculations";

function formatPct(value) {
  return `${Number(value || 0).toFixed(1)}%`;
}

export default function TotalOverheadSummary({
  generalAnnualOverhead,
  vehicleAnnualCost,
  totalAnnualOverhead,
  totalOverheadPerHour,
  generalPct,
  vehiclePct,
}) {
  return (
    <div className="rounded-2xl border bg-card p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Total Overhead Summary</h2>
        <p className="text-sm text-muted-foreground">
          Dollar values show the cold number. Percentages show what is driving
          the overhead profile.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4 rounded-xl border p-4">
          <div>
            <div className="font-medium">General Overheads</div>
            <div className="text-xs text-muted-foreground">
              Small recurring staff costs
            </div>
          </div>
          <div className="text-right">
            <div className="font-semibold">{formatCurrency(generalAnnualOverhead)}</div>
            <div className="text-xs text-muted-foreground">
              ({formatPct(generalPct)})
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-xl border p-4">
          <div>
            <div className="font-medium">Vehicle Cost</div>
            <div className="text-xs text-muted-foreground">
              Recoverable transport and asset cost
            </div>
          </div>
          <div className="text-right">
            <div className="font-semibold">{formatCurrency(vehicleAnnualCost)}</div>
            <div className="text-xs text-muted-foreground">
              ({formatPct(vehiclePct)})
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-xl border bg-muted/30 p-4">
          <div>
            <div className="font-semibold">Total Overhead</div>
            <div className="text-xs text-muted-foreground">
              Full annual recoverable overhead
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold">
              {formatCurrency(totalAnnualOverhead)}
            </div>
            <div className="text-xs text-muted-foreground">(100.0%)</div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-xl border bg-muted/30 p-4">
          <div>
            <div className="font-semibold">Overhead / Hr</div>
            <div className="text-xs text-muted-foreground">
              Based on selected recovery basis
            </div>
          </div>
          <div className="text-right text-lg font-semibold">
            {formatCurrency(totalOverheadPerHour)}
          </div>
        </div>
      </div>
    </div>
  );
}