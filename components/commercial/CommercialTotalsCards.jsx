"use client";

import { Card, CardContent } from "@/components/ui/card";

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

function valueClass(value) {
  const numeric = Number(value || 0);

  if (numeric < 0) return "text-red-600 font-bold";
  if (numeric > 0) return "text-green-600 font-bold";
  return "font-semibold text-foreground";
}

function periodLabel(period) {
  switch (period) {
    case "hourly":
      return "Hourly";
    case "weekly":
      return "Weekly";
    case "monthly":
      return "Monthly";
    case "yearly":
      return "Annual";
    default:
      return "Annual";
  }
}

export default function CommercialTotalsCards({
  totals,
  selectedPeriod = "yearly",
}) {
  const periodData = totals?.periods?.[selectedPeriod] || {};
  const labelPrefix = periodLabel(selectedPeriod);

  const cards = [
    {
      label: `${labelPrefix} Revenue`,
      value: formatMoney(periodData?.revenue),
      hint: `${labelPrefix} revenue across all saved labour profiles.`,
    },
    {
      label: `${labelPrefix} Real Cost`,
      value: formatMoney(periodData?.realCost),
      hint: `${labelPrefix} real cost including employment cost and allocated overhead.`,
    },
    {
      label: `${labelPrefix} Overhead`,
      value: formatMoney(periodData?.overhead),
      hint: `${labelPrefix} overhead allocated across all linked staff profiles.`,
    },
    {
      label: `${labelPrefix} Profit`,
      value: formatMoney(periodData?.profit),
      hint: `${labelPrefix} revenue less ${selectedPeriod === "yearly" ? "annual" : labelPrefix.toLowerCase()} real cost across the portfolio.`,
      className: valueClass(periodData?.profit),
    },
    {
      label: "Portfolio Margin",
      value: formatPercent(totals?.portfolioAnnualMarginPct),
      hint: "Profit divided by revenue across the full portfolio. This percentage does not change by period.",
      className: valueClass(totals?.portfolioAnnualMarginPct),
    },
    {
      label: "Total Productive Hours",
      value: formatNumber(totals?.totalProductiveHours),
      hint: "Combined recovered hours per year across all saved staff profiles.",
    },
    {
      label: "Blended Charge-Out Rate",
      value: formatMoney(totals?.blendedChargeoutRate),
      hint: "Average hourly revenue across the portfolio.",
    },
    {
      label: "Blended Profit / Hr",
      value: formatMoney(totals?.blendedProfitPerHour),
      hint: "Average hourly profit across all included staff profiles.",
      className: valueClass(totals?.blendedProfitPerHour),
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label} className="border-border/60 shadow-sm">
          <CardContent className="p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              {card.label}
            </div>
            <div className={`mt-2 text-2xl ${card.className || "font-bold"}`}>
              {card.value}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{card.hint}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}