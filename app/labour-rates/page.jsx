"use client";

import Link from "next/link";
import LabourRateForm from "@/components/labour/LabourRateForm";
import LabourRateOutput from "@/components/labour/LabourRateOutput";
import CommercialSummaryPanel from "@/components/commercial/CommercialSummaryPanel";
import CollapsibleSection from "@/components/labour/CollapsibleSection";
import { formatCurrency } from "@/lib/calculations/labourPageHelpers";
import { calculateCommercialSummary } from "@/lib/calculations/commercialSummaryHelpers";
import useLabourRatesPage from "@/lib/hooks/useLabourRatesPage";

export default function LabourRatesPage() {
  const {
    form,
    setForm,
    profiles,
    editingId,
    overheadProfiles,
    selectedOverheadProfileId,
    selectedOverheadProfile,
    totalAnnualOverhead,
    paidHoursPerYear,
    overheadPerPaidHour,
    overheadPerProductiveHour,
    results,
    handleSave,
    handleUpdate,
    handleClear,
    handleOverheadChange,
  } = useLabourRatesPage();

  const commercialSummary = calculateCommercialSummary({
    results,
    overheadPerProductiveHour,
  });

  const isEditing = profiles.some(
    (profile) => String(profile.id) === String(editingId)
  );

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8 lg:px-8">

        {/* ================= HEADER ================= */}
        <div className="space-y-3">

          {/* QS Tools + Help */}
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              QS Tools
            </div>

            {/* 👇 Global Help link */}
            <Link
              href="/help"
              className="text-xs text-muted-foreground underline hover:text-foreground"
            >
              Help Centre
            </Link>
          </div>

          {/* Title + description */}
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              NZ Labour Rates
            </h1>

            <p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
              Enter staff labour settings, calculate true cost and profitability,
              then save profiles for later use in quotes.
            </p>

            {/* 👇 Contextual Help */}
            <Link
              href="/help#labour-guide"
              className="inline-block text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              View Labour guide
            </Link>
          </div>
        </div>

        {/* ================= MAIN GRID ================= */}
        <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <LabourRateForm
            form={form}
            setForm={setForm}
            onSave={handleSave}
            onUpdate={handleUpdate}
            onClear={handleClear}
            isEditing={isEditing}
          />

          <LabourRateOutput results={results} />
        </div>

        {/* ================= OVERHEADS ================= */}
        <CollapsibleSection
          title="Employee Overheads"
          defaultOpen={false}
          storageKey="labour-page-employee-overheads"
        >
          <div className="space-y-4">

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">Employee Overheads</h2>
                <p className="text-sm text-muted-foreground">
                  Add staff-specific overheads like phone, PPE, tools, training,
                  software, and other recoverable costs.
                </p>

                {/* 👇 Help link */}
                <Link
                  href="/help#overheads-guide"
                  className="inline-block text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
                >
                  How overhead allocation works
                </Link>
              </div>

              <Link
                href={{
                  pathname: "/employee-overheads",
                  query: {
                    staffName: form.staffName || "",
                    role: form.role || "",
                    labourProfileId: editingId || form.id || "",
                    hoursPerWeek: form.hoursPerWeek || "",
                    efficiencyPct: form.efficiencyPct || "",
                    overheadProfileId: selectedOverheadProfileId || "",
                  },
                }}
                className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium transition hover:bg-accent"
              >
                Manage Overheads
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Overhead Profile
                </label>
                <select
                  className="w-full rounded-xl border bg-background px-3 py-2 text-sm"
                  value={selectedOverheadProfileId}
                  onChange={handleOverheadChange}
                >
                  <option value="">No overhead profile selected</option>
                  {overheadProfiles.map((profile) => (
                    <option key={profile.id} value={profile.id}>
                      {profile.profileName || "Unnamed Profile"}
                    </option>
                  ))}
                </select>

                {selectedOverheadProfile && (
                  <div className="mt-3 rounded-xl border bg-muted/30 p-3 text-sm">
                    <div className="font-semibold">
                      {selectedOverheadProfile.profileName}
                    </div>
                    <div className="text-muted-foreground">
                      {selectedOverheadProfile.staffName || "No staff name"}
                      {selectedOverheadProfile.role
                        ? ` • ${selectedOverheadProfile.role}`
                        : ""}
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-xl border bg-muted/30 p-4">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  Annual Overhead
                </div>
                <div className="mt-1 text-lg font-semibold">
                  {formatCurrency(totalAnnualOverhead)}
                </div>
              </div>

              <div className="rounded-xl border bg-muted/30 p-4">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  Overhead / Productive Hr
                </div>
                <div className="mt-1 text-lg font-semibold">
                  {formatCurrency(overheadPerProductiveHour)}
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border bg-muted/30 p-4">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  Paid Hours / Year
                </div>
                <div className="mt-1 text-lg font-semibold">
                  {paidHoursPerYear.toFixed(2)}
                </div>
              </div>

              <div className="rounded-xl border bg-muted/30 p-4">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  Overhead / Paid Hr
                </div>
                <div className="mt-1 text-lg font-semibold">
                  {formatCurrency(overheadPerPaidHour)}
                </div>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* ================= COMMERCIAL ================= */}
        <CollapsibleSection
          title="Commercial Summary"
          defaultOpen={false}
          storageKey="labour-page-commercial-summary"
        >
          {/* 👇 Help link */}
          <div className="mb-4">
            <Link
              href="/help#commercial-guide"
              className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              How to read this dashboard
            </Link>
          </div>

          <CommercialSummaryPanel commercialSummary={commercialSummary} />
        </CollapsibleSection>

        {/* ================= SAVED PROFILES ================= */}
        <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-base font-semibold">Saved Profiles</h3>
              <p className="text-sm text-muted-foreground">
                {profiles.length} saved labour profile
                {profiles.length === 1 ? "" : "s"} available in Commercial.
              </p>
            </div>

            <Link
              href="/commercial"
              className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium transition hover:bg-accent"
            >
              Open Commercial
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}