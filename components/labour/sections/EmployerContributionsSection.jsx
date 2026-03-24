"use client";

import { Separator } from "@/components/ui/separator";
import CollapsibleSection from "@/components/labour/CollapsibleSection";
import MetricRow from "@/components/labour/MetricRow";
import { money, percent } from "@/lib/utils/formatters";

export default function EmployerContributionsSection({ results }) {
  return (
    <CollapsibleSection title="Employer Contributions" defaultOpen={false}>
      <MetricRow
        label="Employer KiwiSaver (Gross)"
        value={money(results.employer.employerKiwisaverGross)}
        rawValue={results.employer.employerKiwisaverGross}
      />
      <MetricRow
        label="ESCT Rate"
        value={percent(results.employer.esctRate)}
        rawValue={results.employer.esctRate}
      />
      <MetricRow
        label="ESCT Amount"
        value={money(results.employer.esctAmount)}
        rawValue={results.employer.esctAmount}
      />
      <MetricRow
        label="Employer KiwiSaver (Net to Fund)"
        value={money(results.employer.employerKiwisaverTotalCost)}
        rawValue={results.employer.employerKiwisaverTotalCost}
      />
      <Separator className="my-2" />
      <MetricRow
        label="Total Employment Cost"
        value={money(results.employer.totalEmploymentCost)}
        rawValue={results.employer.totalEmploymentCost}
        strong
      />
    </CollapsibleSection>
  );
}