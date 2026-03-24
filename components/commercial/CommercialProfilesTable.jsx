"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function formatMoney(value) {
  return new Intl.NumberFormat("en-NZ", {
    style: "currency",
    currency: "NZD",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

function formatPercent(value) {
  return `${Number(value || 0).toFixed(1)}%`;
}

function statusBadgeClass(status) {
  switch (status) {
    case "healthy":
      return "border-green-300 bg-green-50 text-green-700";
    case "warning":
      return "border-orange-300 bg-orange-50 text-orange-700";
    case "danger":
      return "border-red-300 bg-red-50 text-red-700";
    case "caution":
      return "border-yellow-300 bg-yellow-50 text-yellow-700";
    default:
      return "border-border bg-background text-foreground";
  }
}

function flagBadgeClass(tone) {
  switch (tone) {
    case "healthy":
      return "border-green-200 bg-green-50 text-green-700";
    case "warning":
      return "border-orange-200 bg-orange-50 text-orange-700";
    case "danger":
      return "border-red-200 bg-red-50 text-red-700";
    case "caution":
      return "border-yellow-200 bg-yellow-50 text-yellow-700";
    default:
      return "border-border bg-muted text-foreground";
  }
}

function periodLabel(period) {
  switch (period) {
    case "hourly":
      return "Hr";
    case "weekly":
      return "Week";
    case "monthly":
      return "Month";
    case "yearly":
      return "Year";
    default:
      return "Year";
  }
}

export default function CommercialProfilesTable({
  rows = [],
  onDelete,
  onDuplicate,
  selectedPeriod = "yearly",
}) {
  const label = periodLabel(selectedPeriod);

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle>Commercial Profiles</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/40">
              <tr className="border-b border-border/60 text-left">
                <th className="px-4 py-3 font-semibold">Staff</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Labour Profile</th>
                <th className="px-4 py-3 font-semibold">Overhead Profile</th>
                <th className="px-4 py-3 font-semibold">Revenue ({label})</th>
                <th className="px-4 py-3 font-semibold">Cost ({label})</th>
                <th className="px-4 py-3 font-semibold">Overhead ({label})</th>
                <th className="px-4 py-3 font-semibold">Profit ({label})</th>
                <th className="px-4 py-3 font-semibold">Margin</th>
                <th className="px-4 py-3 font-semibold">Target</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={12}
                    className="px-4 py-8 text-center text-sm text-muted-foreground"
                  >
                    <div className="space-y-3">
                      <div>No saved commercial profiles found yet.</div>
                      <Link
                        href="/labour-rates"
                        className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium transition hover:bg-accent"
                      >
                        Go to Labour Rates
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                rows.map((row) => {
                  const period = row?.periods?.[selectedPeriod] || {};

                  return (
                    <tr
                      key={row.id}
                      className="border-b border-border/50 last:border-b-0"
                    >
                      <td className="px-4 py-3 align-top">
                        <div className="space-y-1.5">
                          <div className="font-semibold">
                            {row.staffName || "Unnamed"}
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {row.flags?.map((flag) => (
                              <span
                                key={flag.key}
                                className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium ${flagBadgeClass(
                                  flag.tone
                                )}`}
                              >
                                {flag.label}
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">{row.role || "—"}</td>

                      <td className="px-4 py-3">
                        {row.labourProfileName || "—"}
                      </td>

                      <td className="px-4 py-3">
                        {row.overheadProfileName || "—"}
                      </td>

                      <td className="px-4 py-3">
                        {formatMoney(period.revenue)}
                      </td>

                      <td className="px-4 py-3">
                        {formatMoney(period.realCost)}
                      </td>

                      <td className="px-4 py-3">
                        {formatMoney(period.overhead)}
                      </td>

                      <td
                        className={`px-4 py-3 font-semibold ${
                          Number(period.profit) < 0
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {formatMoney(period.profit)}
                      </td>

                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <div>{formatPercent(row.marginPct)}</div>
                          <div className="text-xs text-muted-foreground">
                            Rate gap {formatMoney(row.rateGapToTarget)}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <div>{formatPercent(row.targetMarginPct)}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatMoney(row.targetRate)}/hr
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 align-top">
                        <div className="space-y-1.5">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusBadgeClass(
                              row.status
                            )}`}
                          >
                            {row.statusLabel}
                          </span>

                          <div className="text-xs text-muted-foreground">
                            Prod: {formatPercent(row.productivityPct)}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <Link
                            href={`/labour-rates?edit=${encodeURIComponent(
                              row.id
                            )}`}
                            className="inline-flex items-center justify-center rounded-lg border px-3 py-1.5 text-xs font-medium transition hover:bg-accent"
                          >
                            Edit
                          </Link>

                          <button
                            type="button"
                            onClick={() => onDuplicate?.(row.id)}
                            className="inline-flex items-center justify-center rounded-lg border px-3 py-1.5 text-xs font-medium transition hover:bg-accent"
                          >
                            Duplicate
                          </button>

                          <button
                            type="button"
                            onClick={() => onDelete?.(row.id)}
                            className="inline-flex items-center justify-center rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}