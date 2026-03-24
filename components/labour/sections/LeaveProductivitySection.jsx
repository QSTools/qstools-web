"use client";

import { Separator } from "@/components/ui/separator";
import CollapsibleSection from "@/components/labour/CollapsibleSection";
import MetricRow from "@/components/labour/MetricRow";
import { number, percent } from "@/lib/utils/formatters";

export default function LeaveProductivitySection({ results }) {
  return (
    <CollapsibleSection title="Leave & Productivity" defaultOpen={false}>
      <MetricRow
        label="Paid Hours / Year"
        value={number(results.leave.paidHoursPerYear)}
        rawValue={results.leave.paidHoursPerYear}
      />
      <MetricRow
        label="Annual Leave Hours"
        value={number(results.leave.annualLeaveHours)}
        rawValue={results.leave.annualLeaveHours}
      />
      <MetricRow
        label="Public Holiday Hours"
        value={number(results.leave.publicHolidayHours)}
        rawValue={results.leave.publicHolidayHours}
      />
      <MetricRow
        label="Sick Leave Hours"
        value={number(results.leave.sickLeaveHours)}
        rawValue={results.leave.sickLeaveHours}
      />
      <MetricRow
        label="Bereavement Hours"
        value={number(results.leave.bereavementHours)}
        rawValue={results.leave.bereavementHours}
      />
      <MetricRow
        label="Family Violence Hours"
        value={number(results.leave.familyViolenceHours)}
        rawValue={results.leave.familyViolenceHours}
      />
      <Separator className="my-2" />
      <MetricRow
        label="Non-Productive Paid Hours"
        value={number(results.leave.nonProductivePaidHours)}
        rawValue={results.leave.nonProductivePaidHours}
      />
      <MetricRow
        label="Productive Hours / Year"
        value={number(results.leave.productiveHoursPerYear)}
        rawValue={results.leave.productiveHoursPerYear}
      />
      <MetricRow
        label="Efficiency / Productivity %"
        value={percent(results.inputs.efficiencyPct)}
        rawValue={results.inputs.efficiencyPct}
      />
    </CollapsibleSection>
  );
}