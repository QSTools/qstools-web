"use client";

import { Separator } from "@/components/ui/separator";
import CollapsibleSection from "@/components/labour/CollapsibleSection";
import MetricRow from "@/components/labour/MetricRow";
import { money } from "@/lib/utils/formatters";

export default function PayeSection({ results }) {
  return (
    <CollapsibleSection title="PAYE Estimate" defaultOpen={false}>
      <MetricRow
        label="Income Tax"
        value={money(results.paye.incomeTax)}
        rawValue={results.paye.incomeTax}
      />
      <MetricRow
        label="ACC Earner Levy"
        value={money(results.paye.accLevy)}
        rawValue={results.paye.accLevy}
      />
      <MetricRow
        label="Employee KiwiSaver"
        value={money(results.paye.kiwisaverEmployee)}
        rawValue={results.paye.kiwisaverEmployee}
      />
      <Separator className="my-2" />
      <MetricRow
        label="Total Deductions"
        value={money(results.paye.totalDeductions)}
        rawValue={results.paye.totalDeductions}
      />
      <MetricRow
        label="Net Annual"
        value={money(results.paye.netAnnual)}
        rawValue={results.paye.netAnnual}
      />
      <MetricRow
        label="Net Weekly"
        value={money(results.paye.netWeekly)}
        rawValue={results.paye.netWeekly}
      />
      <MetricRow
        label="Net Hourly"
        value={money(results.paye.netHourly)}
        rawValue={results.paye.netHourly}
      />
    </CollapsibleSection>
  );
}