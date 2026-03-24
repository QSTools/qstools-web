// D:\QSTools\qstools-web\lib\analysis\commercialInsights.js

function num(...values) {
  for (const value of values) {
    const parsed = Number(value);
    if (!Number.isNaN(parsed) && Number.isFinite(parsed)) return parsed;
  }
  return 0;
}

function text(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function formatMoney(value) {
  return new Intl.NumberFormat("en-NZ", {
    style: "currency",
    currency: "NZD",
    maximumFractionDigits: 2,
  }).format(num(value));
}

function formatPercent(value) {
  return `${num(value).toFixed(1)}%`;
}

function getPeriodMeta(period) {
  switch (period) {
    case "hourly":
      return { key: "hourly", label: "Hourly" };
    case "weekly":
      return { key: "weekly", label: "Weekly" };
    case "monthly":
      return { key: "monthly", label: "Monthly" };
    case "yearly":
    default:
      return { key: "yearly", label: "Annual" };
  }
}

function getRecoveredHours(row) {
  return num(
    row?.recoveredHours,
    row?.productiveHours,
    row?.basis?.recoveredHoursPerYear,
    row?.paidHoursPerYear
  );
}

function convertAnnualToPeriod(value, period, hoursPerYear = 0) {
  switch (period) {
    case "hourly":
      return hoursPerYear > 0 ? num(value) / hoursPerYear : 0;
    case "weekly":
      return num(value) / 52;
    case "monthly":
      return num(value) / 12;
    case "yearly":
    default:
      return num(value);
  }
}

function getPeriodValue(row, selectedPeriod, metric) {
  return num(row?.periods?.[selectedPeriod]?.[metric]);
}

function getBestRow(rows) {
  if (!rows.length) return null;

  return [...rows].sort((a, b) => {
    if (num(b.marginPct) !== num(a.marginPct)) {
      return num(b.marginPct) - num(a.marginPct);
    }

    return num(b.annualProfit) - num(a.annualProfit);
  })[0];
}

function getWorstRow(rows) {
  if (!rows.length) return null;

  return [...rows].sort((a, b) => {
    if (num(a.marginPct) !== num(b.marginPct)) {
      return num(a.marginPct) - num(b.marginPct);
    }

    return num(a.annualProfit) - num(b.annualProfit);
  })[0];
}

function getBiggestProfitLeak(rows) {
  const negativeRows = rows.filter((row) => num(row.annualProfit) < 0);

  if (!negativeRows.length) return null;

  return [...negativeRows].sort(
    (a, b) => num(a.annualProfit) - num(b.annualProfit)
  )[0];
}

function buildPortfolioImpactAfterFix(rows, selectedPeriod, annualTargetUpside) {
  const improvedAnnualProfit =
    rows.reduce((sum, row) => sum + num(row.annualProfit), 0) +
    num(annualTargetUpside);

  const totalAnnualRevenue = rows.reduce(
    (sum, row) => sum + num(row.annualRevenue),
    0
  );

  const avgRecoveredHours =
    rows.length > 0
      ? rows.reduce((sum, row) => sum + getRecoveredHours(row), 0) / rows.length
      : 0;

  const improvedMargin =
    totalAnnualRevenue > 0 ? (improvedAnnualProfit / totalAnnualRevenue) * 100 : 0;

  return {
    improvedAnnualProfit,
    improvedDisplayProfit: convertAnnualToPeriod(
      improvedAnnualProfit,
      selectedPeriod,
      avgRecoveredHours
    ),
    improvedMargin,
  };
}

function buildMetricCards({
  totalDisplayProfit,
  averageMargin,
  rows,
  totalDisplayRevenue,
  totalAnnualProfit,
  losingMoneyCount,
  belowTargetCount,
  missingOverheadCount,
  lowProductivityCount,
  selectedPeriod,
}) {
  const periodMeta = getPeriodMeta(selectedPeriod);

  return [
    {
      key: "display-profit",
      label: `${periodMeta.label} Profit`,
      value: formatMoney(totalDisplayProfit),
      tone: totalDisplayProfit < 0 ? "danger" : "healthy",
    },
    {
      key: "average-margin",
      label: "Average Margin",
      value: formatPercent(averageMargin),
      tone: averageMargin < 0 ? "danger" : averageMargin < 20 ? "warning" : "healthy",
    },
    {
      key: "saved-profiles",
      label: "Saved Profiles",
      value: String(rows.length),
      tone: "neutral",
    },
    {
      key: "display-revenue",
      label: `${periodMeta.label} Revenue`,
      value: formatMoney(totalDisplayRevenue),
      tone: "neutral",
    },
    {
      key: "annual-profit-reference",
      label: "Annual Profit",
      value: formatMoney(totalAnnualProfit),
      tone: totalAnnualProfit < 0 ? "danger" : "healthy",
    },
    {
      key: "losing-money",
      label: "Losing Money",
      value: String(losingMoneyCount),
      tone: losingMoneyCount > 0 ? "danger" : "healthy",
    },
    {
      key: "below-target",
      label: "Below Target",
      value: String(belowTargetCount),
      tone: belowTargetCount > 0 ? "warning" : "healthy",
    },
    {
      key: "missing-overheads",
      label: "Missing Overheads",
      value: String(missingOverheadCount),
      tone: missingOverheadCount > 0 ? "warning" : "healthy",
    },
    {
      key: "low-productivity",
      label: "Low Productivity",
      value: String(lowProductivityCount),
      tone: lowProductivityCount > 0 ? "warning" : "healthy",
    },
  ];
}

function buildAlerts({
  rows,
  losingMoneyRows,
  belowTargetRows,
  missingOverheadRows,
  lowProductivityRows,
}) {
  const alerts = [];

  if (losingMoneyRows.length) {
    losingMoneyRows.forEach((row) => {
      alerts.push(`${text(row.staffName, "A profile")} is losing money.`);
    });
  }

  if (belowTargetRows.length) {
    belowTargetRows.forEach((row) => {
      alerts.push(`${text(row.staffName, "A profile")} is below target margin.`);
    });
  }

  if (missingOverheadRows.length) {
    missingOverheadRows.forEach((row) => {
      alerts.push(`${text(row.staffName, "A profile")} has no linked overhead profile.`);
    });
  }

  if (lowProductivityRows.length) {
    lowProductivityRows.forEach((row) => {
      alerts.push(
        `${text(row.staffName, "A profile")} has low productivity assumptions.`
      );
    });
  }

  if (!alerts.length && rows.length) {
    alerts.push("No additional commercial actions detected.");
  }

  return alerts;
}

function buildStory({
  rows,
  totalAnnualProfit,
  belowTargetCount,
  losingMoneyCount,
  bestRow,
}) {
  if (!rows.length) {
    return ["No saved labour profiles are available yet."];
  }

  const story = [
    `You are generating approximately ${formatMoney(
      totalAnnualProfit
    )} annual profit across ${rows.length} saved profile${rows.length === 1 ? "" : "s"}.`,
  ];

  if (losingMoneyCount > 0) {
    story.push(
      `${losingMoneyCount} profile${
        losingMoneyCount === 1 ? " is" : "s are"
      } currently losing money and need${losingMoneyCount === 1 ? "s" : ""} immediate attention.`
    );
  }

  if (belowTargetCount > 0) {
    story.push(
      `${belowTargetCount} profile${
        belowTargetCount === 1 ? " is" : "s are"
      } below target margin, which is reducing overall portfolio performance.`
    );
  }

  if (bestRow) {
    story.push(
      `${text(bestRow.staffName, "Your top performer")} is currently your strongest performer at ${formatPercent(
        bestRow.marginPct
      )} margin.`
    );
  }

  return story;
}

function buildRecommendations({
  rows,
  selectedPeriod,
  losingMoneyRows,
  belowTargetRows,
  missingOverheadRows,
}) {
  const recommendations = [];

  if (missingOverheadRows.length) {
    recommendations.push({
      key: "missing-overhead",
      label: "Link Overhead Profiles",
      tone: "warning",
      text: `${missingOverheadRows.length} profile${
        missingOverheadRows.length === 1 ? " is" : "s are"
      } missing linked overheads. Commercial results may be understated until those profiles are linked.`,
      impact: "This improves completeness rather than immediate profit.",
    });
  }

  if (losingMoneyRows.length) {
    const biggestLeak = getBiggestProfitLeak(rows);

    if (biggestLeak) {
      const breakEvenGapPerHour = Math.max(0, num(biggestLeak.realCostPerHour) - num(biggestLeak.chargeoutRate));
      const annualImprovement = breakEvenGapPerHour * getRecoveredHours(biggestLeak);

      const displayGap = convertAnnualToPeriod(
        annualImprovement,
        selectedPeriod,
        getRecoveredHours(biggestLeak)
      );

      recommendations.push({
        key: "break-even",
        label: "Break-even Rate",
        tone: "danger",
        text: `Increase ${text(
          biggestLeak.staffName,
          "this profile"
        )} by ${formatMoney(breakEvenGapPerHour)}/hr to break even.`,
        impact: `Improvement: ${formatMoney(displayGap)}${
          selectedPeriod === "hourly"
            ? "/Hour"
            : selectedPeriod === "weekly"
            ? "/Week"
            : selectedPeriod === "monthly"
            ? "/Month"
            : "/Year"
        } · Annual: ${formatMoney(annualImprovement)}`,
      });
    }
  }

  if (belowTargetRows.length) {
    const worstRow = getWorstRow(belowTargetRows);

    if (worstRow) {
      const targetGapPerHour = Math.max(
        0,
        num(worstRow.targetRate) - num(worstRow.chargeoutRate)
      );

      const annualTargetUpside = targetGapPerHour * getRecoveredHours(worstRow);

      const portfolioImpact = buildPortfolioImpactAfterFix(
        rows,
        selectedPeriod,
        annualTargetUpside
      );

      recommendations.push({
        key: "target-rate",
        label: "Target Rate Opportunity",
        tone: num(worstRow.profitPerHour) < 0 ? "warning" : "caution",
        text: `Increase ${text(
          worstRow.staffName,
          "this profile"
        )} by ${formatMoney(targetGapPerHour)}/hr to hit target.`,
        impact: `Portfolio profit becomes ${formatMoney(
          portfolioImpact.improvedAnnualProfit
        )}/Year · Margin improves to ${formatPercent(
          portfolioImpact.improvedMargin
        )}`,
      });
    }
  }

  if (!recommendations.length && rows.length) {
    recommendations.push({
      key: "healthy",
      label: "No Immediate Action Needed",
      tone: "healthy",
      text: "No additional commercial actions detected.",
      impact: "The current portfolio looks commercially stable.",
    });
  }

  return recommendations;
}

export function buildCommercialInsights(rows = [], selectedPeriod = "yearly") {
  const safeRows = Array.isArray(rows) ? rows : [];

  const totalAnnualProfit = safeRows.reduce(
    (sum, row) => sum + num(row.annualProfit),
    0
  );

  const totalAnnualRevenue = safeRows.reduce(
    (sum, row) => sum + num(row.annualRevenue),
    0
  );

  const totalDisplayProfit = safeRows.reduce(
    (sum, row) => sum + getPeriodValue(row, selectedPeriod, "profit"),
    0
  );

  const totalDisplayRevenue = safeRows.reduce(
    (sum, row) => sum + getPeriodValue(row, selectedPeriod, "revenue"),
    0
  );

  const averageMargin =
    totalAnnualRevenue > 0 ? (totalAnnualProfit / totalAnnualRevenue) * 100 : 0;

  const losingMoneyRows = safeRows.filter((row) => num(row.profitPerHour) < 0);
  const belowTargetRows = safeRows.filter(
    (row) => num(row.marginPct) < num(row.targetMarginPct)
  );
  const missingOverheadRows = safeRows.filter((row) => !row?.overheads?.linked);
  const lowProductivityRows = safeRows.filter((row) => {
    const productivity = num(row.productivityPct);
    return productivity > 0 && productivity < 75;
  });

  const losingMoneyCount = losingMoneyRows.length;
  const belowTargetCount = belowTargetRows.length;
  const missingOverheadCount = missingOverheadRows.length;
  const lowProductivityCount = lowProductivityRows.length;

  const bestRow = getBestRow(safeRows);
  const worstRow = getWorstRow(safeRows);

  const topPerformer = bestRow
    ? {
        name: text(bestRow.staffName, "Unnamed profile"),
        marginText: formatPercent(bestRow.marginPct),
        profitText: formatMoney(getPeriodValue(bestRow, selectedPeriod, "profit")),
      }
    : null;

  const biggestImprovementOpportunity = worstRow
    ? {
        name: text(worstRow.staffName, "Unnamed profile"),
        marginText: formatPercent(worstRow.marginPct),
        profitText: formatMoney(getPeriodValue(worstRow, selectedPeriod, "profit")),
      }
    : null;

  const metrics = buildMetricCards({
    totalDisplayProfit,
    averageMargin,
    rows: safeRows,
    totalDisplayRevenue,
    totalAnnualProfit,
    losingMoneyCount,
    belowTargetCount,
    missingOverheadCount,
    lowProductivityCount,
    selectedPeriod,
  });

  const recommendations = buildRecommendations({
    rows: safeRows,
    selectedPeriod,
    losingMoneyRows,
    belowTargetRows,
    missingOverheadRows,
  });

  const alerts = buildAlerts({
    rows: safeRows,
    losingMoneyRows,
    belowTargetRows,
    missingOverheadRows,
    lowProductivityRows,
  });

  const story = buildStory({
    rows: safeRows,
    totalAnnualProfit,
    belowTargetCount,
    losingMoneyCount,
    bestRow,
  });

  return {
    metrics,
    topPerformer,
    biggestImprovementOpportunity,
    alerts,
    story,
    recommendations,
  };
}

export default buildCommercialInsights;