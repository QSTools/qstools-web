function num(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
}

function text(value, fallback = "") {
    return typeof value === "string" && value.trim() ? value.trim() : fallback;
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

function pluralize(count, singular, plural) {
    return `${count} ${count === 1 ? singular : plural}`;
}

function getPeriodMeta(period = "yearly") {
    switch (period) {
        case "hourly":
            return { key: "hourly", label: "Hourly", shortLabel: "Hr" };
        case "weekly":
            return { key: "weekly", label: "Weekly", shortLabel: "Week" };
        case "monthly":
            return { key: "monthly", label: "Monthly", shortLabel: "Month" };
        case "yearly":
        default:
            return { key: "yearly", label: "Annual", shortLabel: "Year" };
    }
}

function getPeriodValue(row, period, field) {
    return num(row?.periods?.[period]?.[field]);
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

function buildAlerts(rows) {
    const alerts = [];

    rows.forEach((row) => {
        const name = text(row.staffName, "Unnamed profile");

        if (num(row.profitPerHour) < 0) {
            alerts.push(`${name} is losing money.`);
        }

        if (num(row.marginPct) < num(row.targetMarginPct)) {
            alerts.push(`${name} is below target margin.`);
        }

        if (!row?.overheads?.linked) {
            alerts.push(`${name} has no linked overhead profile.`);
        }

        if (num(row.productivityPct) > 0 && num(row.productivityPct) < 75) {
            alerts.push(`${name} has low productivity.`);
        }
    });

    return alerts;
}

function buildStory({
    rows,
    selectedPeriod,
    totalDisplayProfit,
    losingMoneyCount,
    belowTargetCount,
    missingOverheadCount,
    bestRow,
    worstRow,
}) {
    if (!rows.length) {
        return [
            "No saved labour profiles have been loaded yet.",
            "Save labour and overhead profiles to build a commercial portfolio view.",
        ];
    }

    const periodMeta = getPeriodMeta(selectedPeriod);
    const story = [];

    story.push(
        `You are generating approximately ${formatMoney(
            totalDisplayProfit
        )} ${periodMeta.label.toLowerCase()} profit across ${pluralize(
            rows.length,
            "saved profile",
            "saved profiles"
        )}.`
    );

    if (losingMoneyCount > 0) {
        story.push(
            `${pluralize(
                losingMoneyCount,
                "profile is",
                "profiles are"
            )} currently losing money and ${losingMoneyCount === 1 ? "needs" : "need"
            } immediate attention.`
        );
    }

    if (belowTargetCount > 0) {
        story.push(
            `${pluralize(
                belowTargetCount,
                "profile is",
                "profiles are"
            )} below target margin, which is reducing overall portfolio performance.`
        );
    }

    if (missingOverheadCount > 0) {
        story.push(
            `${pluralize(
                missingOverheadCount,
                "profile has",
                "profiles have"
            )} no linked overhead allocation, so results may be understated.`
        );
    }

    if (bestRow) {
        const bestName = text(bestRow.staffName, "Unnamed profile");
        story.push(
            `${bestName} is currently your strongest performer at ${formatPercent(
                bestRow.marginPct
            )} margin.`
        );
    }

    if (worstRow && rows.length > 1) {
        const worstName = text(worstRow.staffName, "Unnamed profile");
        story.push(
            `${worstName} is your weakest performer and the best candidate for improvement.`
        );
    }

    return story;
}

function buildOpportunityRow(row) {
    if (!row) return null;

    const chargeoutRate = num(row.chargeoutRate);
    const targetRate = num(row.targetRate);
    const realCostPerHour = num(row.realCostPerHour);
    const productiveHours = num(row.productiveHours);

    const breakEvenGapPerHour = Math.max(0, realCostPerHour - chargeoutRate);
    const targetGapPerHour = Math.max(0, targetRate - chargeoutRate);

    const annualBreakEvenUpside = breakEvenGapPerHour * productiveHours;
    const annualTargetUpside = targetGapPerHour * productiveHours;

    return {
        rowId: row.id,
        staffName: text(row.staffName, "Unnamed profile"),
        currentRate: chargeoutRate,
        breakEvenRate: realCostPerHour,
        targetRate,
        breakEvenGapPerHour,
        targetGapPerHour,
        annualBreakEvenUpside,
        annualTargetUpside,
    };
}

function convertAnnualToPeriod(value, period) {
    switch (period) {
        case "hourly":
            return num(value) / 1664;
        case "weekly":
            return num(value) / 52;
        case "monthly":
            return num(value) / 12;
        case "yearly":
        default:
            return num(value);
    }
}

function buildPortfolioImpactAfterFix(rows, opportunity, selectedPeriod) {
    if (!rows.length || !opportunity) return null;

    const currentAnnualProfit = rows.reduce(
        (sum, row) => sum + num(row.annualProfit),
        0
    );

    const improvedAnnualProfit =
        currentAnnualProfit + num(opportunity.annualTargetUpside);

    const totalAnnualRevenue = rows.reduce(
        (sum, row) => sum + num(row.annualRevenue),
        0
    );

    const improvedMargin =
        totalAnnualRevenue > 0 ? (improvedAnnualProfit / totalAnnualRevenue) * 100 : 0;

    return {
        improvedAnnualProfit,
        improvedDisplayProfit: convertAnnualToPeriod(
            improvedAnnualProfit,
            selectedPeriod
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

export function buildCommercialInsights(
    rows = [],
    selectedPeriod = "yearly"
) {
    const safeRows = Array.isArray(rows) ? rows : [];
    const periodMeta = getPeriodMeta(selectedPeriod);

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
    const biggestProfitLeak = getBiggestProfitLeak(safeRows);

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

    const biggestLeak = biggestProfitLeak
        ? {
            name: text(biggestProfitLeak.staffName, "Unnamed profile"),
            profitText: formatMoney(
                getPeriodValue(biggestProfitLeak, selectedPeriod, "profit")
            ),
            marginText: formatPercent(biggestProfitLeak.marginPct),
        }
        : null;

    const pricingOpportunity = buildOpportunityRow(biggestProfitLeak || worstRow);
    const portfolioImpact = buildPortfolioImpactAfterFix(
        safeRows,
        pricingOpportunity,
        selectedPeriod
    );

    const recommendations = [];

    if (pricingOpportunity && pricingOpportunity.breakEvenGapPerHour > 0) {
        recommendations.push({
            key: "break-even",
            label: "Break-even Rate",
            text: `Increase ${pricingOpportunity.staffName} by ${formatMoney(
                pricingOpportunity.breakEvenGapPerHour
            )}/hr to break even.`,
            impact: `Improvement: ${formatMoney(
                convertAnnualToPeriod(
                    pricingOpportunity.annualBreakEvenUpside,
                    selectedPeriod
                )
            )}/${periodMeta.shortLabel} · Annual: ${formatMoney(
                pricingOpportunity.annualBreakEvenUpside
            )}`,
            tone: "warning",
        });
    }

    if (pricingOpportunity && pricingOpportunity.targetGapPerHour > 0) {
        recommendations.push({
            key: "target-rate",
            label: "Target Rate Opportunity",
            text: `Increase ${pricingOpportunity.staffName} by ${formatMoney(
                pricingOpportunity.targetGapPerHour
            )}/hr to hit target.`,
            impact: portfolioImpact
                ? `Portfolio profit becomes ${formatMoney(
                    portfolioImpact.improvedDisplayProfit
                )}/${periodMeta.shortLabel} · Margin improves to ${formatPercent(
                    portfolioImpact.improvedMargin
                )}`
                : `Improvement: ${formatMoney(
                    convertAnnualToPeriod(
                        pricingOpportunity.annualTargetUpside,
                        selectedPeriod
                    )
                )}/${periodMeta.shortLabel} · Annual: ${formatMoney(
                    pricingOpportunity.annualTargetUpside
                )}`,
            tone: "healthy",
        });
    }

    if (missingOverheadCount > 0) {
        recommendations.push({
            key: "overhead-link",
            label: "Overhead Linkage",
            text: `Link overheads for ${pluralize(
                missingOverheadCount,
                "1 profile",
                `${missingOverheadCount} profiles`
            )} to improve result accuracy.`,
            impact: "Results may currently be understated.",
            tone: "warning",
        });
    }

    if (lowProductivityCount > 0) {
        recommendations.push({
            key: "productivity",
            label: "Productivity Improvement",
            text: `${pluralize(
                lowProductivityCount,
                "1 profile is",
                `${lowProductivityCount} profiles are`
            )} below the productivity threshold.`,
            impact: "Recoverable hours may be limiting profitability.",
            tone: "warning",
        });
    }

    return {
        metrics: buildMetricCards({
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
        }),
        topPerformer,
        biggestImprovementOpportunity,
        biggestLeak,
        alerts: buildAlerts(safeRows),
        story: buildStory({
            rows: safeRows,
            selectedPeriod,
            totalDisplayProfit,
            losingMoneyCount,
            belowTargetCount,
            missingOverheadCount,
            bestRow,
            worstRow,
        }),
        recommendations,
    };
}