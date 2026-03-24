"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import InfoTooltip from "@/components/ui/info-tooltip";
import MetricRow from "@/components/labour/MetricRow";
import { money, percent } from "@/lib/utils/formatters";
import { marginClass } from "@/lib/utils/classHelpers";
import { LABOUR_TOOLTIPS } from "@/lib/constants/labourTooltips";

export default function ProfitabilityCard({ results, marginTier }) {
  return (
    <Card className="overflow-visible border-border/60 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle>Profitability</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 overflow-visible">
        <MetricRow
          label="Profit / Hr"
          value={money(results.profit.profitPerHour)}
          rawValue={results.profit.profitPerHour}
          strong
        />
        <MetricRow
          label="Profit / Day"
          value={money(results.profit.profitPerDay)}
          rawValue={results.profit.profitPerDay}
        />
        <MetricRow
          label="Profit / Week"
          value={money(results.profit.profitPerWeek)}
          rawValue={results.profit.profitPerWeek}
        />
        <MetricRow
          label="Profit / Year"
          value={money(results.profit.profitPerYear)}
          rawValue={results.profit.profitPerYear}
        />
        <Separator className="my-2" />
        <MetricRow
          label={
            <div className="flex items-center gap-2">
              <span>Margin %</span>
              <InfoTooltip content={LABOUR_TOOLTIPS.marginPct} />
            </div>
          }
          value={percent(results.profit.marginPct)}
          rawValue={results.profit.marginPct}
          className={marginClass(marginTier)}
          strong
        />
        <MetricRow
          label={
            <div className="flex items-center gap-2">
              <span>Markup %</span>
              <InfoTooltip content={LABOUR_TOOLTIPS.markupPct} />
            </div>
          }
          value={percent(results.profit.markupPct)}
          rawValue={results.profit.markupPct}
        />
      </CardContent>
    </Card>
  );
}