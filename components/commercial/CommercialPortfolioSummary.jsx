"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InfoTooltip from "@/components/ui/info-tooltip";

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

function formatNumber(value) {
  return new Intl.NumberFormat("en-NZ", {
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function tierClasses(tier) {
  switch (tier) {
    case "danger":
      return "border-red-300 bg-red-50 text-red-700";
    case "warning":
      return "border-orange-300 bg-orange-50 text-orange-700";
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
    case "healthy":
      return "Commercially healthy";
    default:
      return "Review required";
  }
}

function getPortfolioTier(totals) {
  const annualProfit = Number(totals?.totalAnnualProfit || 0);
  const annualMargin = Number(totals?.portfolioAnnualMarginPct || 0);
  const avgTarget = Number(totals?.avgTargetMarginPct || 0);

  if (annualProfit < 0) return "danger";
  if (annualMargin < avgTarget) return "warning";
  return "healthy";
}

function buildFlags({ rows = [], totals = {} }) {
  const flags = [];

  const annualProfit = Number(totals?.totalAnnualProfit || 0);
  const annualMargin = Number(totals?.portfolioAnnualMarginPct || 0);
  const avgTarget = Number(totals?.avgTargetMarginPct || 0);
  const profileCount = Number(totals?.profileCount || 0);
  const totalHours = Number(totals?.totalProductiveHours || 0);

  if (profileCount === 0) {
    flags.push({
      type: "warning",
      label: "No saved profiles",
      message:
        "There are no saved labour profiles in the portfolio yet, so the commercial summary is empty.",
    });

    return flags;
  }

  if (annualProfit < 0) {
    flags.push({
      type: "danger",
      label: "Portfolio losing money",
      message:
        "The combined annual profit is negative. At the current rates, the portfolio is not commercially sustainable.",
    });
  }

  if (annualMargin < avgTarget) {
    flags.push({
      type: "warning",
      label: "Below target margin",
      message:
        "The overall portfolio margin is below the average target margin set across the saved labour profiles.",
    });
  }

  if (totalHours <= 0) {
    flags.push({
      type: "danger",
      label: "No productive hours",
      message:
        "Recovered hours are zero or missing, so the commercial rollups cannot reflect a realistic trading position.",
    });
  }

  const belowTargetCount = rows.filter(
    (row) => Number(row?.marginPct || 0) < Number(row?.targetMarginPct || 0)
  ).length;

  if (belowTargetCount > 0) {
    flags.push({
      type: "warning",
      label: "Profiles under target",
      message: `${belowTargetCount} of ${profileCount} saved profiles are currently below their target margin.`,
    });
  }

  const losingCount = rows.filter((row) => Number(row?.profitPerHour || 0) < 0).length;

  if (losingCount > 0) {
    flags.push({
      type: "danger",
      label: "Profiles losing money",
      message: `${losingCount} of ${profileCount} saved profiles are generating a negative hourly profit.`,
    });
  }

  if (flags.length === 0) {
    flags.push({
      type: "healthy",
      label: "Portfolio in good shape",
      message:
        "The saved labour portfolio is profitable overall and is meeting or exceeding its target margin position.",
    });
  }

  return flags;
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

export default function CommercialPortfolioSummary({ portfolio }) {
  if (!portfolio) return null;

  const totals = portfolio?.totals || {};
  const rows = portfolio?.rows || [];
  const tier = getPortfolioTier(totals);
  const flags = buildFlags({ rows, totals });

  return (
    <Card className="overflow-visible border-border/60 shadow-sm">
      <CardHeader className="gap-3 pb-3">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Portfolio Summary
            </div>

            <div>
              <CardTitle className="text-xl">Commercial Portfolio Summary</CardTitle>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
                Consolidated business view across all saved labour profiles and
                linked overhead allocations.
              </p>
            </div>
          </div>

          <div
            className={`inline-flex h-fit rounded-full border px-3 py-1 text-sm font-semibold ${tierClasses(
              tier
            )}`}
          >
            {tierLabel(tier)}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-4">
            <div className="rounded-2xl border bg-muted/20 p-4">
              <div className="mb-3">
                <div className="text-sm font-semibold text-foreground">
                  Portfolio Overview
                </div>
                <div className="text-xs text-muted-foreground">
                  Top-level business position across the saved labour portfolio.
                </div>
              </div>

              <div className="divide-y divide-border/60">
                <MetricRow
                  label="Saved Profiles"
                  tooltip="The total number of labour profiles currently included in the commercial portfolio."
                  value={formatNumber(totals?.profileCount)}
                  subtext="Each profile represents one saved labour commercial setup."
                />
                <MetricRow
                  label="Total Productive Hours / Year"
                  tooltip="Combined recovered hours per year across all saved labour profiles."
                  value={formatNumber(totals?.totalProductiveHours)}
                  subtext="This is the annual productive-hours base driving the portfolio rollups."
                />
                <MetricRow
                  label="Average Target Margin"
                  tooltip="Average target margin from the saved labour profiles."
                  value={formatPercent(totals?.avgTargetMarginPct)}
                  subtext="Used as a high-level benchmark for the overall portfolio."
                />
                <MetricRow
                  label="Portfolio Margin"
                  tooltip="Combined annual profit divided by combined annual revenue."
                  value={formatPercent(totals?.portfolioAnnualMarginPct)}
                  subtext="Overall commercial margin for the whole portfolio."
                  valueClassName={
                    Number(totals?.portfolioAnnualMarginPct || 0) <
                    Number(totals?.avgTargetMarginPct || 0)
                      ? "font-bold text-red-600"
                      : "font-bold text-green-600"
                  }
                />
              </div>
            </div>

            <div className="rounded-2xl border bg-muted/20 p-4">
              <div className="mb-3">
                <div className="text-sm font-semibold text-foreground">
                  Hourly Trading View
                </div>
                <div className="text-xs text-muted-foreground">
                  Blended hourly position across the portfolio.
                </div>
              </div>

              <div className="divide-y divide-border/60">
                <MetricRow
                  label="Blended Charge-Out Rate"
                  tooltip="Average hourly sell rate across the portfolio."
                  value={formatMoney(totals?.blendedChargeoutRate)}
                  subtext="Useful for quick pricing and market-position checks."
                />
                <MetricRow
                  label="Blended Real Cost / Hr"
                  tooltip="Average true hourly cost including allocated overhead."
                  value={formatMoney(totals?.blendedRealCostRate)}
                  subtext="This is the average recovered cost base across the saved profiles."
                />
                <MetricRow
                  label="Blended Profit / Hr"
                  tooltip="Average hourly profit across the portfolio."
                  value={formatMoney(totals?.blendedProfitPerHour)}
                  subtext="Charge-out less real cost, averaged across saved profiles."
                  valueClassName={
                    Number(totals?.blendedProfitPerHour || 0) < 0
                      ? "font-bold text-red-600"
                      : "font-bold text-green-600"
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border bg-muted/20 p-4">
              <div className="mb-3">
                <div className="text-sm font-semibold text-foreground">
                  Annual Business View
                </div>
                <div className="text-xs text-muted-foreground">
                  Annualised revenue, cost, overhead, and profit across the portfolio.
                </div>
              </div>

              <div className="divide-y divide-border/60">
                <MetricRow
                  label="Annual Revenue"
                  tooltip="Total annual revenue using saved charge-out rates and productive hours."
                  value={formatMoney(totals?.totalAnnualRevenue)}
                  subtext="Commercial output potential from the current saved portfolio."
                />
                <MetricRow
                  label="Annual Real Cost"
                  tooltip="Total annual employment cost plus allocated overhead."
                  value={formatMoney(totals?.totalAnnualRealCost)}
                  subtext="What the portfolio truly costs to recover across the year."
                />
                <MetricRow
                  label="Annual Overhead"
                  tooltip="Total overhead allocated across all linked saved profiles."
                  value={formatMoney(totals?.totalAnnualOverhead)}
                  subtext="Included inside annual real cost and also shown separately for visibility."
                />
                <MetricRow
                  label="Annual Profit"
                  tooltip="Annual revenue less annual real cost."
                  value={formatMoney(totals?.totalAnnualProfit)}
                  subtext="Top-level annual commercial contribution from the portfolio."
                  valueClassName={
                    Number(totals?.totalAnnualProfit || 0) < 0
                      ? "font-bold text-red-600"
                      : "font-bold text-green-600"
                  }
                />
              </div>
            </div>

            <div className="rounded-2xl border bg-muted/20 p-4">
              <div className="mb-3">
                <div className="text-sm font-semibold text-foreground">
                  Alerts & Flags
                </div>
                <div className="text-xs text-muted-foreground">
                  Quick read of commercial health across the whole labour portfolio.
                </div>
              </div>

              <div className="grid gap-3">
                {flags.map((flag, index) => (
                  <FlagItem key={`${flag.label}-${index}`} flag={flag} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}