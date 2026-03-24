"use client";

import { Suspense } from "react";
import Link from "next/link";
import VehicleCostSection from "@/components/overheads/VehicleCostSection";
import TotalOverheadSummary from "@/components/overheads/TotalOverheadSummary";
import EmployeeOverheadForm from "@/components/overheads/EmployeeOverheadForm";
import GeneralOverheadsSection from "@/components/overheads/GeneralOverheadsSection";
import SavedOverheadProfiles from "@/components/overheads/SavedOverheadProfiles";
import ProfileStatusBar from "@/components/overheads/ProfileStatusBar";
import OverheadFlagPanel from "@/components/overheads/OverheadFlagPanel";
import CollapsibleSection from "@/components/overheads/CollapsibleSection";
import useEmployeeOverheadsPage from "@/lib/hooks/useEmployeeOverheadsPage";

function EmployeeOverheadsPageContent() {
  const {
    form,
    labourProfiles,
    profiles,
    selectedLabourProfile,
    summary,
    handleChange,
    handleLabourProfileSelect,
    handleLoadProfile,
    handleNewProfile,
    handleSaveOrUpdate,
    handleDelete,
    router,
  } = useEmployeeOverheadsPage();

  const {
    vehicle,
    generalAnnualOverhead,
    totalAnnualOverhead,
    totalOverheadPerHour,
    generalPct,
    vehiclePct,
  } = summary;

  return (
    <main className="min-h-screen bg-background px-6 py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Employee Overheads</h1>
            <p className="text-sm text-muted-foreground">
              Create overhead profiles per staff member.
            </p>

            <Link
              href="/help#overheads-guide"
              className="inline-block text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              How overhead allocation works
            </Link>
          </div>

          <button
            onClick={() => router.push("/labour-rates")}
            className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            ← Back to Labour Rates
          </button>
        </div>

        <ProfileStatusBar
          form={form}
          selectedLabourProfile={selectedLabourProfile}
          summary={summary}
        />

        <EmployeeOverheadForm
          form={form}
          labourProfiles={labourProfiles}
          onChange={handleChange}
          onLabourProfileSelect={handleLabourProfileSelect}
        />

        <CollapsibleSection
          title="General Employee Overheads"
          description="Enter the cost frequency and amount. Everything is converted to an annual value automatically."
          defaultOpen={true}
        >
          <GeneralOverheadsSection
            form={form}
            onChange={handleChange}
            generalAnnualOverhead={generalAnnualOverhead}
          />
        </CollapsibleSection>

        <CollapsibleSection
          title="Vehicle Costs"
          description="Vehicle ownership and running cost recovery."
          defaultOpen={form.vehicleEnabled}
        >
          <VehicleCostSection
            form={form}
            onChange={handleChange}
            vehicle={vehicle}
          />
        </CollapsibleSection>

        <CollapsibleSection
          title="Alerts & Flags"
          description="Quick checks to help validate whether this overhead profile looks commercially realistic."
          defaultOpen={true}
        >
          <OverheadFlagPanel
            generalAnnualOverhead={generalAnnualOverhead}
            vehicleAnnualCost={vehicle.vehicleAnnualCost}
            totalAnnualOverhead={totalAnnualOverhead}
            totalOverheadPerHour={totalOverheadPerHour}
            generalPct={generalPct}
            vehiclePct={vehiclePct}
            vehicleEnabled={form.vehicleEnabled}
          />
        </CollapsibleSection>

        <CollapsibleSection
          title="Total Overhead Summary"
          description="Cold numbers and contribution split."
          defaultOpen={true}
        >
          <TotalOverheadSummary
            generalAnnualOverhead={generalAnnualOverhead}
            vehicleAnnualCost={vehicle.vehicleAnnualCost}
            totalAnnualOverhead={totalAnnualOverhead}
            totalOverheadPerHour={totalOverheadPerHour}
            generalPct={generalPct}
            vehiclePct={vehiclePct}
          />
        </CollapsibleSection>

        <div className="rounded-2xl border bg-card p-6">
          <div className="flex items-end justify-between gap-3">
            <button
              onClick={handleNewProfile}
              className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-accent"
            >
              New Profile
            </button>

            <button
              onClick={handleSaveOrUpdate}
              className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-accent"
            >
              {form.id ? "Update Profile" : "Save Profile"}
            </button>
          </div>
        </div>

        <CollapsibleSection
          title="Saved Overhead Profiles"
          description="Load, review, and delete existing profiles."
          defaultOpen={false}
        >
          <SavedOverheadProfiles
            profiles={profiles}
            onLoad={handleLoadProfile}
            onDelete={handleDelete}
          />
        </CollapsibleSection>
      </div>
    </main>
  );
}

export default function EmployeeOverheadsPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading employee overheads...</div>}>
      <EmployeeOverheadsPageContent />
    </Suspense>
  );
}