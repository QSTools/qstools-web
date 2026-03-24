"use client";

import FlagPanel from "@/components/labour/FlagPanel";
import CommercialStatusPanel from "@/components/labour/CommercialStatusPanel";
import SummaryCard from "@/components/labour/SummaryCard";
import ProfitabilityCard from "@/components/labour/ProfitabilityCard";
import CollapsibleSection from "@/components/labour/CollapsibleSection";
import PayeSection from "@/components/labour/sections/PayeSection";
import EmployerContributionsSection from "@/components/labour/sections/EmployerContributionsSection";
import LeaveProductivitySection from "@/components/labour/sections/LeaveProductivitySection";

export default function LabourRateOutput({ results }) {
  if (!results) return null;

  const effectiveCost = Number(
    results.loaded?.effectiveRecoveredCostPerHour || 0
  );
  const chargeoutRate = Number(results.profit?.chargeoutRate || 0);
  const loadedHourly = Number(results.loaded?.hourly || 0);
  const targetRate = Number(results.loaded?.targetRate || 0);
  const rateGapToTarget = Number(results.loaded?.rateGapToTarget || 0);
  const targetMarginPct = Number(results.profit?.targetMarginPct || 20);
  const marginPct = Number(results.profit?.marginPct || 0);

  const marginTier = results.status?.marginTier || "healthy";
  const flags = results.status?.flags || [];

  const roundedEffectiveCost = Number(effectiveCost.toFixed(2));
  const roundedChargeoutRate = Number(chargeoutRate.toFixed(2));
  const roundedTargetRate = Number(targetRate.toFixed(2));
  const roundedRateGapToTarget = Number(rateGapToTarget.toFixed(2));
  const roundedRecoveryGap = Number(
    (roundedChargeoutRate - roundedEffectiveCost).toFixed(2)
  );

  const effectiveCostRowClass =
    roundedChargeoutRate < roundedEffectiveCost ? "font-bold text-red-600" : "";

  return (
    <div className="space-y-6">
      <CommercialStatusPanel
        effectiveCost={roundedEffectiveCost}
        chargeoutRate={roundedChargeoutRate}
        targetRate={roundedTargetRate}
        marginPct={marginPct}
        marginTier={marginTier}
      />

      <FlagPanel flags={flags} />

      <SummaryCard
        results={results}
        loadedHourly={loadedHourly}
        effectiveCost={roundedEffectiveCost}
        chargeoutRate={roundedChargeoutRate}
        targetMarginPct={targetMarginPct}
        targetRate={roundedTargetRate}
        rateGapToTarget={roundedRateGapToTarget}
        recoveryGap={roundedRecoveryGap}
        effectiveCostRowClass={effectiveCostRowClass}
      />

      <CollapsibleSection
        title="Profitability"
        defaultOpen={false}
        storageKey="labour-output-profitability"
      >
        <ProfitabilityCard results={results} marginTier={marginTier} />
      </CollapsibleSection>

      <CollapsibleSection
        title="Detailed Labour Breakdown"
        defaultOpen={false}
        storageKey="labour-output-detailed-breakdown"
      >
        <div className="space-y-6">
          <PayeSection results={results} />
          <EmployerContributionsSection results={results} />
          <LeaveProductivitySection results={results} />
        </div>
      </CollapsibleSection>
    </div>
  );
}