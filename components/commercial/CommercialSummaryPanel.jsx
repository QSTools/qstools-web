"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InfoTooltip from "@/components/ui/info-tooltip";
import { COMMERCIAL_TOOLTIPS } from "@/lib/constants/commercialTooltips";

const PERIOD_OPTIONS = [
  { key: "hourly", label: "Hourly" },
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
  { key: "yearly", label: "Yearly" },
];

function formatMoney(value) {
  return new Intl.NumberFormat("en-NZ", {
    style: "currency",
    currency: "NZD",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

function formatPercent(value) {
  return `${Number(value || 0).toFixed(2)}%`;
}

function valueClass(value, positiveMode = false) {
  const numeric = Number(value || 0);

  if (numeric < 0) return "font-bold text-red-600";
  if (positiveMode && numeric > 0) return "font-bold text-green-600";

  return "font-semibold text-foreground";
}

function tierClasses(tier) {
  switch (tier) {
    case "danger":
      return "border-red-300 bg-red-50 text-red-700";
    case "warning":
      return "border-orange-300 bg-orange-50 text-orange-700";
    case "caution":
      return "border-yellow-300 bg-yellow-50 text-yellow-700";
    case "healthy":
      return "border-green-300 bg-green-50 text-green-700";
    default:
      return "border-border bg-muted/30 text-foreground";
  }
}

function tierLabel(tier) {
  switch (tier) {
    case "danger":
      return "Commercial risk";
    case "warning":
      return "Below target";
    case "caution":
      return "Tight recovery";
    case "healthy":
      return "Commercially healthy";
    default:
      return "Review required";
  }
}

function PeriodToggle({ selectedPeriod, onChange }) {
  return (
    <div className="inline-flex rounded-xl border border-border bg-muted/40 p-1">
      {PERIOD_OPTIONS.map((option) => {
        const active = selectedPeriod === option.key;

        return (
          <button
            key={option.key}
            type="button"
            onClick={() => onChange(option.key)}
            className={[
              "rounded-lg px-3 py-1.5 text-sm font-medium transition",
              active
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function MetricRow({
  label,
  tooltip,
  value,
  subtext,
  valueClassName = "font-semibold text-foreground",
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <div className="min-w-0">
        <div className="flex items-center gap-1 text-sm font-medium text-foreground">
          <span>{label}</span>
          {tooltip ? <InfoTooltip content={tooltip} /> : null}
        </div>
        {subtext ? (
          <div className="mt-1 text-xs leading-5 text-muted-foreground">
            {subtext}
          </div>
        ) : null}
      </div>

      <div className={`shrink-0 text-sm ${valueClassName}`}>{value}</div>
    </div>
  );
}

function FlagItem({ flag }) {
  return (
    <div
      className={`rounded-xl border px-3 py-2 text-sm ${tierClasses(flag.type)}`}
    >
      <div className="font-semibold">{flag.label}</div>
      <div className="mt-1 text-xs leading-5 opacity-90">{flag.message}</div>
    </div>
  );
}

export default function CommercialSummaryPanel({ commercialSummary }) {
  const [selectedPeriod, setSelectedPeriod] = useState("hourly");

  const periodData = useMemo(() => {
    return commercialSummary?.periods?.[selectedPeriod] || {};
  }, [commercialSummary, selectedPeriod]);

  if (!commercialSummary) return null;

  const { percentages, status, summary, basis } = commercialSummary;

  const flags = status?.flags || [];
  const tier = status?.tier || "default";

  const periodLabel =
    PERIOD_OPTIONS.find((item) => item.key === selectedPeriod)?.label || "Hourly";

  return (
    <Card className="overflow-visible border-border/60 shadow-sm">
      <CardHeader className="gap-4 pb-3">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Commercial Summary
            </div>

            <div>
              <CardTitle className="text-xl">Commercial Summary Panel</CardTitle>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
                Combines total employment cost, recovered hours, and selected
                employee overheads into one commercial view for pricing.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start gap-3 lg:items-end">
            <PeriodToggle
              selectedPeriod={selectedPeriod}
              onChange={setSelectedPeriod}
            />

            <div
              className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${tierClasses(
                tier
              )}`}
            >
              {tierLabel(tier)}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="rounded-2xl border bg-muted/20 p-4">
              <div className="mb-3 flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    Cost Stack
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Showing {periodLabel.toLowerCase()} values based on recovered
                    hours. Total Employment Cost equals gross pay plus employer
                    on-costs before overhead.
                  </div>
                </div>
              </div>

              <div className="divide-y divide-border/60">
                <MetricRow
                  label="Total Employment Cost"
                  tooltip={COMMERCIAL_TOOLTIPS.loadedLabour}
                  value={formatMoney(periodData.loadedLabour)}
                  subtext="Gross pay plus employer on-costs before overhead allocation."
                />
                <MetricRow
                  label="Overhead"
                  tooltip={COMMERCIAL_TOOLTIPS.overhead}
                  value={formatMoney(periodData.overhead)}
                  subtext="Selected employee overheads allocated across recovered hours."
                />
                <MetricRow
                  label="True Cost"
                  tooltip={COMMERCIAL_TOOLTIPS.trueCost}
                  value={formatMoney(periodData.trueCost)}
                  valueClassName={valueClass(periodData.trueCost)}
                  subtext="Total employment cost plus allocated overhead."
                />
              </div>
            </div>

            <div className="rounded-2xl border bg-muted/20 p-4">
              <div className="mb-3">
                <div className="text-sm font-semibold text-foreground">
                  Sell & Recovery
                </div>
                <div className="text-xs text-muted-foreground">
                  Current selling position against your target.
                </div>
              </div>

              <div className="divide-y divide-border/60">
                <MetricRow
                  label="Charge-out"
                  tooltip={COMMERCIAL_TOOLTIPS.chargeout}
                  value={formatMoney(periodData.chargeout)}
                  subtext="Current sell rate being tested."
                />
                <MetricRow
                  label="Target Rate"
                  tooltip={COMMERCIAL_TOOLTIPS.targetRate}
                  value={formatMoney(periodData.targetRate)}
                  subtext="Sell rate needed to achieve the selected target margin."
                />
                <MetricRow
                  label="Recovery Gap"
                  tooltip={COMMERCIAL_TOOLTIPS.recoveryGap}
                  value={formatMoney(periodData.recoveryGap)}
                  valueClassName={valueClass(periodData.recoveryGap, true)}
                  subtext="Charge-out minus true recovered cost."
                />
                <MetricRow
                  label="Rate Gap to Target"
                  tooltip={COMMERCIAL_TOOLTIPS.rateGapToTarget}
                  value={formatMoney(periodData.rateGapToTarget)}
                  valueClassName={valueClass(periodData.rateGapToTarget, true)}
                  subtext="How far current rate is above or below target rate."
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border bg-muted/20 p-4">
              <div className="mb-3">
                <div className="text-sm font-semibold text-foreground">
                  Profitability
                </div>
                <div className="text-xs text-muted-foreground">
                  Commercial outcome for the selected period.
                </div>
              </div>

              <div className="divide-y divide-border/60">
                <MetricRow
                  label="Profit"
                  tooltip={COMMERCIAL_TOOLTIPS.profit}
                  value={formatMoney(periodData.profit)}
                  valueClassName={valueClass(periodData.profit, true)}
                  subtext="Sell less recovered cost."
                />
                <MetricRow
                  label="Margin %"
                  tooltip={COMMERCIAL_TOOLTIPS.marginPct}
                  value={formatPercent(percentages.marginPct)}
                  valueClassName={valueClass(percentages.marginPct, true)}
                  subtext="Profit divided by sell price."
                />
                <MetricRow
                  label="Markup %"
                  tooltip={COMMERCIAL_TOOLTIPS.markupPct}
                  value={formatPercent(percentages.markupPct)}
                  valueClassName={valueClass(percentages.markupPct, true)}
                  subtext="Profit divided by cost."
                />
                <MetricRow
                  label="Target Margin %"
                  tooltip={COMMERCIAL_TOOLTIPS.marginPct}
                  value={formatPercent(percentages.targetMarginPct)}
                  subtext="Selected pricing goal."
                />
              </div>
            </div>

            <div className="rounded-2xl border bg-muted/20 p-4">
              <div className="mb-3">
                <div className="text-sm font-semibold text-foreground">
                  Commercial Basis
                </div>
                <div className="text-xs text-muted-foreground">
                  Yearly recovery assumptions driving the rollups.
                </div>
              </div>

              <div className="divide-y divide-border/60">
                <MetricRow
                  label="Recovered Hours / Year"
                  tooltip={COMMERCIAL_TOOLTIPS.recoveredHours}
                  value={Number(basis?.recoveredHoursPerYear || 0).toFixed(2)}
                  subtext="Used to convert hourly values into weekly, monthly, and yearly views."
                />
                <MetricRow
                  label="Base True Cost / Hr"
                  tooltip={COMMERCIAL_TOOLTIPS.trueCost}
                  value={formatMoney(summary.trueCostPerHour)}
                  subtext="Always shown on an hourly basis for pricing reference."
                />
                <MetricRow
                  label="Base Charge-out / Hr"
                  tooltip={COMMERCIAL_TOOLTIPS.chargeout}
                  value={formatMoney(summary.chargeoutRate)}
                  subtext="Always shown on an hourly basis for pricing reference."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-muted/20 p-4">
          <div className="mb-3">
            <div className="text-sm font-semibold text-foreground">
              Alerts & Flags
            </div>
            <div className="text-xs text-muted-foreground">
              Quick read of commercial health for the current pricing setup.
            </div>
          </div>

          {flags.length ? (
            <div className="grid gap-3 md:grid-cols-2">
              {flags.map((flag, index) => (
                <FlagItem key={`${flag.label}-${index}`} flag={flag} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-background px-3 py-3 text-sm text-muted-foreground">
              No active commercial flags for this setup.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}