"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import InfoTooltip from "@/components/ui/info-tooltip";
import MetricRow from "@/components/labour/MetricRow";
import { money, percent } from "@/lib/utils/formatters";
import { LABOUR_TOOLTIPS } from "@/lib/constants/labourTooltips";

export default function SummaryCard({
  results,
  loadedHourly,
  effectiveCost,
  chargeoutRate,
  targetMarginPct,
  targetRate,
  rateGapToTarget,
  recoveryGap,
  effectiveCostRowClass = "",
}) {
  return (
    <Card className="overflow-visible border-border/60 shadow-sm">
      <CardHeader className="pb-2">
        <div className="space-y-1">
          <div className="text-xl font-semibold text-foreground">
            {results.staffName || "Unnamed Profile"}
            {results.staffTag ? ` (${results.staffTag})` : ""}
          </div>

          {results.role && (
            <div className="text-xs text-muted-foreground">{results.role}</div>
          )}

          <CardTitle className="pt-2 text-sm uppercase tracking-wide text-muted-foreground">
            Summary
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-1 overflow-visible">
        <MetricRow
          label="Gross Hourly Rate"
          value={money(results.gross.hourly)}
          rawValue={results.gross.hourly}
        />
        <MetricRow
          label="Gross Annual Rate"
          value={money(results.gross.annual)}
          rawValue={results.gross.annual}
        />
        <MetricRow
          label={
            <div className="flex items-center gap-2">
              <span>Loaded Hourly Cost</span>
              <InfoTooltip content={LABOUR_TOOLTIPS.loadedHourlyCost} />
            </div>
          }
          value={money(loadedHourly)}
          rawValue={loadedHourly}
        />
        <MetricRow
          label={
            <div className="flex items-center gap-2">
              <span>Real Cost / Hr</span>
              <InfoTooltip content={LABOUR_TOOLTIPS.effectiveRecoveredCost} />
            </div>
          }
          value={money(effectiveCost)}
          rawValue={effectiveCost}
          strong
          className={effectiveCostRowClass}
        />
        <MetricRow
          label={
            <div className="flex items-center gap-2">
              <span>Charge-Out Rate</span>
              <InfoTooltip content={LABOUR_TOOLTIPS.chargeoutRate} />
            </div>
          }
          value={money(chargeoutRate)}
          rawValue={chargeoutRate}
          strong
        />
        <MetricRow
          label={
            <div className="flex items-center gap-2">
              <span>Target Margin %</span>
              <InfoTooltip content={LABOUR_TOOLTIPS.targetMarginPct} />
            </div>
          }
          value={percent(targetMarginPct)}
          rawValue={targetMarginPct}
        />
        <MetricRow
          label={
            <div className="flex items-center gap-2">
              <span>Target Rate</span>
              <InfoTooltip content={LABOUR_TOOLTIPS.targetRate} />
            </div>
          }
          value={money(targetRate)}
          rawValue={targetRate}
          strong
        />
        <MetricRow
          label={
            <div className="flex items-center gap-2">
              <span>Rate Gap to Target</span>
              <InfoTooltip content={LABOUR_TOOLTIPS.rateGapToTarget} />
            </div>
          }
          value={
            rateGapToTarget >= 0
              ? `+${money(rateGapToTarget)}`
              : `-${money(Math.abs(rateGapToTarget))}`
          }
          rawValue={rateGapToTarget}
          strong
        />
        <Separator className="my-2" />
        <MetricRow
          label={
            <div className="flex items-center gap-2">
              <span>Recovery Gap</span>
              <InfoTooltip content={LABOUR_TOOLTIPS.recoveryGap} />
            </div>
          }
          value={
            recoveryGap >= 0
              ? `+${money(recoveryGap)}`
              : `-${money(Math.abs(recoveryGap))}`
          }
          rawValue={recoveryGap}
          strong
        />
      </CardContent>
    </Card>
  );
}