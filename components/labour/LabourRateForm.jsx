"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import CollapsibleSection from "@/components/labour/CollapsibleSection";
import { TAX_CODE_OPTIONS } from "@/lib/config/nzTaxRates";

function FieldLabel({ label, help }) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium text-foreground">
      <span>{label}</span>
      {help ? (
        <span
          className="inline-flex h-5 w-5 cursor-help items-center justify-center rounded-full border border-border bg-muted text-[11px] font-semibold text-muted-foreground"
          title={help}
        >
          i
        </span>
      ) : null}
    </label>
  );
}

function SelectField({ label, value, onChange, options, help }) {
  return (
    <div className="space-y-2">
      <FieldLabel label={label} help={help} />
      <select
        value={value}
        onChange={onChange}
        className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none ring-offset-background transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  step = "0.01",
  help,
  danger = false,
  min,
  max,
}) {
  return (
    <div className="space-y-2">
      <FieldLabel label={label} help={help} />
      <Input
        type="number"
        step={step}
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        className={danger ? "border-red-500 font-semibold text-red-600" : ""}
      />
    </div>
  );
}

function TextField({ label, value, onChange, placeholder = "", help }) {
  return (
    <div className="space-y-2">
      <FieldLabel label={label} help={help} />
      <Input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}

function ToggleRow({ label, checked, onCheckedChange, help }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/60 px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {help ? (
          <span
            className="inline-flex h-5 w-5 cursor-help items-center justify-center rounded-full border border-border bg-muted text-[11px] font-semibold text-muted-foreground"
            title={help}
          >
            i
          </span>
        ) : null}
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

function ActionButton({ children, onClick, variant = "default" }) {
  const styles =
    variant === "outline"
      ? "border border-border bg-background text-foreground hover:bg-muted"
      : variant === "destructive"
        ? "bg-red-600 text-white hover:bg-red-700"
        : "bg-primary text-primary-foreground hover:opacity-90";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors ${styles}`}
    >
      {children}
    </button>
  );
}

function SectionTitle({ children }) {
  return (
    <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
    </h3>
  );
}

const TARGET_MARGIN_OPTIONS = [
  { value: "10", label: "10%" },
  { value: "15", label: "15%" },
  { value: "20", label: "20%" },
  { value: "25", label: "25%" },
  { value: "30", label: "30%" },
];

export default function LabourRateForm({
  form,
  setForm,
  onSave,
  onUpdate,
  onClear,
  isEditing,
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  function updateField(name, value) {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const baseRate = Number(form.baseHourlyRate || 0);
  const chargeoutRate = Number(form.chargeoutRate || 0);
  const efficiencyPct = Number(form.efficiencyPct || 0);
  const targetMarginPct = Number(form.targetMarginPct || 20);

  const includeEmployerKiwisaver = form.includeEmployerKiwisaver ?? true;
  const includeAnnualLeave = form.includeAnnualLeave ?? true;
  const includePublicHolidays = form.includePublicHolidays ?? true;
  const includeSickLeave = form.includeSickLeave ?? true;
  const includeBereavement = form.includeBereavement ?? true;
  const includeFamilyViolence = form.includeFamilyViolence ?? false;

  const baseRateDanger = baseRate < 0;
  const chargeoutDanger =
    chargeoutRate < 0 || (chargeoutRate > 0 && chargeoutRate < baseRate);
  const efficiencyDanger = efficiencyPct < 0 || efficiencyPct > 100;
  const targetMarginDanger = targetMarginPct < 0 || targetMarginPct > 95;

  const employerKsPreview = includeEmployerKiwisaver
    ? `Employer KS ${form.employerKiwisaverPct ?? 3}%`
    : "Employer KS Off";

  const annualLeavePreview = `AL ${form.annualLeaveWeeks ?? 4}w`;
  const publicHolidayPreview = `PH ${form.publicHolidays ?? 11}`;
  const sickDaysPreview = `Sick ${form.sickDays ?? 10}`;

  const advancedPreview = [
    employerKsPreview,
    annualLeavePreview,
    publicHolidayPreview,
    sickDaysPreview,
  ].join(" · ");

  return (
    <div className="space-y-6">
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle>
            {isEditing ? "Edit Labour Profile" : "Labour Inputs"}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              label="Staff Tag"
              value={form.staffTag}
              onChange={(e) => updateField("staffTag", e.target.value)}
              placeholder="e.g. PD, HAY, LAB1"
              help="Short internal code for the staff member. Useful for tables, exports, and saved profiles."
            />

            <TextField
              label="Staff Name"
              value={form.staffName}
              onChange={(e) => updateField("staffName", e.target.value)}
              placeholder="e.g. Paul Davis"
              help="Full name of the staff member or labour category."
            />

            <TextField
              label="Role"
              value={form.role}
              onChange={(e) => updateField("role", e.target.value)}
              placeholder="e.g. Director / QS"
              help="Role or position. Helps distinguish charge-out strategy between field labour, admin, QS, or management."
            />

            <SelectField
              label="Tax Code"
              value={form.taxCode}
              onChange={(e) => updateField("taxCode", e.target.value)}
              options={TAX_CODE_OPTIONS}
              help="NZ tax code used for PAYE estimation. This is for modelling only, not payroll filing."
            />

            <NumberField
              label="Base Hourly Rate"
              value={form.baseHourlyRate}
              onChange={(e) => updateField("baseHourlyRate", e.target.value)}
              help="The actual wage paid per hour before employer on-costs like KiwiSaver and leave loading."
              danger={baseRateDanger}
              min="0"
            />

            <NumberField
              label="Hours Per Week"
              value={form.hoursPerWeek}
              onChange={(e) => updateField("hoursPerWeek", e.target.value)}
              help="Standard paid hours per week. Usually 40 for full-time staff."
              min="0"
            />

            <NumberField
              label="Charge-Out Rate"
              value={form.chargeoutRate}
              onChange={(e) => updateField("chargeoutRate", e.target.value)}
              help="The hourly rate charged to the client. This should recover labour cost, overhead, and profit."
              danger={chargeoutDanger}
              min="0"
            />

            <NumberField
              label="Efficiency / Productivity %"
              value={form.efficiencyPct}
              onChange={(e) => updateField("efficiencyPct", e.target.value)}
              help="The percentage of paid time that is truly productive and recoverable. Site conditions often mean this is below 100%."
              danger={efficiencyDanger}
              min="0"
              max="100"
            />

            <NumberField
              label="Employee KiwiSaver %"
              value={form.kiwisaverPct}
              onChange={(e) => updateField("kiwisaverPct", e.target.value)}
              help="Employee KiwiSaver deduction used for take-home pay modelling."
              min="0"
              max="100"
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <SectionTitle>Pricing Target</SectionTitle>

            <div className="grid gap-4 md:grid-cols-2">
              <SelectField
                label="Target Margin Preset"
                value={String(form.targetMarginPct ?? 20)}
                onChange={(e) => updateField("targetMarginPct", e.target.value)}
                options={TARGET_MARGIN_OPTIONS}
                help="Quick-select a target labour margin. This is used to calculate the target charge-out rate."
              />

              <NumberField
                label="Target Margin %"
                value={form.targetMarginPct ?? 20}
                onChange={(e) => updateField("targetMarginPct", e.target.value)}
                help="The profit margin you want to achieve after loaded cost and productivity are taken into account. You can use the preset list or manually overwrite it here."
                danger={targetMarginDanger}
                min="0"
                max="95"
                step="0.1"
              />
            </div>

            <div className="rounded-lg border border-border/60 bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
              This target margin is used to calculate the recommended charge-out
              rate. The summary will also show the{" "}
              <span className="font-medium text-foreground">
                Rate Gap to Target
              </span>
              , which is the difference between your actual charge-out rate and
              the rate required to hit your selected target margin.
            </div>
          </div>

          {(baseRateDanger ||
            chargeoutDanger ||
            efficiencyDanger ||
            targetMarginDanger) && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              Please review highlighted fields. Negative values, unrealistic
              efficiency, invalid target margin, or a charge-out rate below wage
              level may distort results.
            </div>
          )}

          <Separator />

          <div className="rounded-lg border border-border/60 bg-muted/20">
            <button
              type="button"
              onClick={() => setShowAdvanced((prev) => !prev)}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <div>
                <div className="text-sm font-semibold text-foreground">
                  Advanced Labour Assumptions
                </div>
                <div className="text-xs text-muted-foreground">
                  Employer KiwiSaver, ESCT, leave settings, and entitlement
                  assumptions
                </div>
                {!showAdvanced && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    {advancedPreview}
                  </div>
                )}
              </div>

              <span className="text-xs font-medium text-muted-foreground">
                {showAdvanced ? "Hide" : "Show"}
              </span>
            </button>
          </div>

          {showAdvanced && (
            <>
              <Separator />

              <div className="space-y-4">
                <SectionTitle>Employer Contributions</SectionTitle>

                <div className="grid gap-3">
                  <ToggleRow
                    label="Include Employer KiwiSaver"
                    checked={includeEmployerKiwisaver}
                    onCheckedChange={(checked) =>
                      updateField("includeEmployerKiwisaver", checked)
                    }
                    help="Adds employer KiwiSaver and ESCT into the true employment cost."
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <NumberField
                    label="Employer KiwiSaver %"
                    value={form.employerKiwisaverPct}
                    onChange={(e) =>
                      updateField("employerKiwisaverPct", e.target.value)
                    }
                    help="Usually 3% in NZ unless a different employer contribution rate applies."
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <SectionTitle>Leave Entitlements</SectionTitle>

                <div className="grid gap-3">
                  <ToggleRow
                    label="Include Annual Leave"
                    checked={includeAnnualLeave}
                    onCheckedChange={(checked) =>
                      updateField("includeAnnualLeave", checked)
                    }
                    help="Includes paid annual leave in labour loading."
                  />

                  <ToggleRow
                    label="Include Public Holidays"
                    checked={includePublicHolidays}
                    onCheckedChange={(checked) =>
                      updateField("includePublicHolidays", checked)
                    }
                    help="Includes public holiday entitlement in non-productive paid time."
                  />

                  <ToggleRow
                    label="Include Sick Leave"
                    checked={includeSickLeave}
                    onCheckedChange={(checked) =>
                      updateField("includeSickLeave", checked)
                    }
                    help="Includes sick leave allowance in the loaded labour cost."
                  />

                  <ToggleRow
                    label="Include Bereavement Leave"
                    checked={includeBereavement}
                    onCheckedChange={(checked) =>
                      updateField("includeBereavement", checked)
                    }
                    help="Includes bereavement leave as part of paid but non-productive time."
                  />

                  <ToggleRow
                    label="Include Family Violence Leave"
                    checked={includeFamilyViolence}
                    onCheckedChange={(checked) =>
                      updateField("includeFamilyViolence", checked)
                    }
                    help="Optional leave category available in NZ employment modelling where relevant."
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <NumberField
                    label="Annual Leave Weeks"
                    value={form.annualLeaveWeeks}
                    onChange={(e) =>
                      updateField("annualLeaveWeeks", e.target.value)
                    }
                    help="Standard NZ annual leave is commonly 4 weeks."
                    min="0"
                  />

                  <NumberField
                    label="Public Holidays"
                    value={form.publicHolidays}
                    onChange={(e) =>
                      updateField("publicHolidays", e.target.value)
                    }
                    help="Number of paid public holidays to include."
                    min="0"
                  />

                  <NumberField
                    label="Sick Days"
                    value={form.sickDays}
                    onChange={(e) => updateField("sickDays", e.target.value)}
                    help="Number of paid sick days assumed per year."
                    min="0"
                  />

                  <NumberField
                    label="Bereavement Days"
                    value={form.bereavementDays}
                    onChange={(e) =>
                      updateField("bereavementDays", e.target.value)
                    }
                    help="Number of bereavement leave days to include in the cost model."
                    min="0"
                  />

                  <NumberField
                    label="Family Violence Days"
                    value={form.familyViolenceDays}
                    onChange={(e) =>
                      updateField("familyViolenceDays", e.target.value)
                    }
                    help="Optional leave allowance for family violence leave."
                    min="0"
                  />
                </div>
              </div>
            </>
          )}

          <Separator />

          <div className="flex flex-wrap gap-3">
            {isEditing ? (
              <ActionButton onClick={onUpdate}>Update Profile</ActionButton>
            ) : (
              <ActionButton onClick={onSave}>Save Profile</ActionButton>
            )}

            <ActionButton
              onClick={() => {
                const confirmReset = window.confirm(
                  "Start a new staff profile? This will clear the current form."
                );
                if (confirmReset) {
                  onClear();
                }
              }}
              variant="outline"
            >
              New Staff Member
            </ActionButton>
          </div>
        </CardContent>
      </Card>

      <CollapsibleSection
        title="Calculator Notes"
        defaultOpen={false}
        storageKey="labour-form-calculator-notes"
      >
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            This calculator converts a base hourly wage into a more realistic
            annual employment cost by including paid leave, employer KiwiSaver,
            and ESCT.
          </p>
          <p>
            It then spreads those costs over productive hours only, which gives a
            truer loaded labour rate for estimating and management decisions.
          </p>
          <p>
            Efficiency / productivity is one of the biggest drivers of real
            labour recovery. Lower efficiency increases the effective cost per
            recoverable hour.
          </p>
          <p>
            The target margin lets you model what you want to achieve
            commercially, not just what it costs to employ someone.
          </p>
          <p>
            Use the Labour page to build and update one profile at a time.
            Saved profiles are then reviewed, compared, duplicated, edited, and
            managed from the Commercial page.
          </p>
          <p>
            This is an estimating and management tool only. It is not a payroll,
            accounting, or legal compliance system.
          </p>
        </div>
      </CollapsibleSection>
    </div>
  );
}