"use client";

import Link from "next/link";
import CommercialInsightsPanel from "@/components/commercial/CommercialInsightsPanel";
import CommercialPortfolioSummary from "@/components/commercial/CommercialPortfolioSummary";
import CommercialTotalsCards from "@/components/commercial/CommercialTotalsCards";
import CommercialProfilesTable from "@/components/commercial/CommercialProfilesTable";
import {
  buildCommercialPortfolio,
  loadCommercialPortfolioData,
  saveLabourProfilesToStorage,
} from "@/lib/calculations/commercialPortfolioHelpers";
import { buildCommercialInsights } from "@/lib/analysis/commercialInsights";
import { useEffect, useMemo, useState } from "react";

const PERIOD_OPTIONS = [
  { key: "hourly", label: "Hourly" },
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
  { key: "yearly", label: "Yearly" },
];

function PeriodToggle({ selectedPeriod, onChange }) {
  return (
    <div className="inline-flex rounded-xl border border-border bg-muted/40 p-1">
      {PERIOD_OPTIONS.map((option) => {
        const active = selectedPeriod === option.key;

        return (
          <button
            key={option.key}
            type="button"
            onClick={() => onChange(option.key)}
            className={[
              "rounded-lg px-3 py-1.5 text-sm font-medium transition",
              active
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export default function CommercialPage() {
  const [labourProfiles, setLabourProfiles] = useState([]);
  const [overheadProfiles, setOverheadProfiles] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("yearly");

  function loadData() {
    console.log("=== COMMERCIAL PAGE loadData() START ===");

    if (typeof window !== "undefined") {
      console.log("=== PAGE LOCAL STORAGE KEYS ===");
      for (let i = 0; i < window.localStorage.length; i += 1) {
        const key = window.localStorage.key(i);
        console.log("KEY:", key);
      }
    }

    const { labour, overheads } = loadCommercialPortfolioData();

    console.log("LOADED LABOUR FROM STORAGE:", labour);
    console.log("LOADED OVERHEADS FROM STORAGE:", overheads);

    setLabourProfiles(labour);
    setOverheadProfiles(overheads);
  }

  useEffect(() => {
    console.log("=== COMMERCIAL PAGE MOUNT ===");
    loadData();
  }, []);

  useEffect(() => {
    function handleFocus() {
      console.log("=== WINDOW FOCUS ===");
      loadData();
    }

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  useEffect(() => {
    console.log("=== STATE UPDATE ===");
    console.log("labourProfiles:", labourProfiles);
    console.log("overheadProfiles:", overheadProfiles);
  }, [labourProfiles, overheadProfiles]);

  const portfolio = useMemo(() => {
    console.log("=== BUILD PORTFOLIO ===");
    return buildCommercialPortfolio(labourProfiles, overheadProfiles);
  }, [labourProfiles, overheadProfiles]);

  const insightsData = useMemo(() => {
    console.log("=== BUILD INSIGHTS ===");
    return buildCommercialInsights(portfolio?.rows || [], selectedPeriod);
  }, [portfolio, selectedPeriod]);

  function handleDeleteLabourProfile(profileId) {
    const confirmed = window.confirm(
      "Delete this labour profile from saved profiles?"
    );

    if (!confirmed) return;

    const nextProfiles = labourProfiles.filter((profile) => {
      const id = profile?.id || profile?.profileId || profile?.uuid;
      return id !== profileId;
    });

    setLabourProfiles(nextProfiles);
    saveLabourProfilesToStorage(nextProfiles);
  }

  function handleDuplicateLabourProfile(profileId) {
    const profileToDuplicate = labourProfiles.find((profile) => {
      const id = profile?.id || profile?.profileId || profile?.uuid;
      return id === profileId;
    });

    if (!profileToDuplicate) return;

    const duplicateId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `labour-${Date.now()}`;

    const duplicateName =
      profileToDuplicate.profileName ||
      profileToDuplicate.name ||
      profileToDuplicate.staffName ||
      "Copied Profile";

    const duplicatedProfile = {
      ...profileToDuplicate,
      id: duplicateId,
      profileId: duplicateId,
      name: `${duplicateName} Copy`,
      profileName: `${duplicateName} Copy`,
    };

    const nextProfiles = [...labourProfiles, duplicatedProfile];

    setLabourProfiles(nextProfiles);
    saveLabourProfilesToStorage(nextProfiles);
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 md:px-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Commercial</h1>
          <p className="text-sm text-muted-foreground">
            Business-level commercial summary combining saved labour and employee
            overhead profiles.
          </p>

          <Link
            href="/help#commercial-guide"
            className="inline-block text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            How to read this dashboard
          </Link>
        </div>

        <Link
          href="/labour-rates"
          className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted"
        >
          ← Back to Labour
        </Link>
      </div>

      <PeriodToggle
        selectedPeriod={selectedPeriod}
        onChange={setSelectedPeriod}
      />

      <CommercialInsightsPanel insightsData={insightsData} />

      <CommercialPortfolioSummary portfolio={portfolio} />

      <CommercialTotalsCards
        totals={portfolio.totals}
        selectedPeriod={selectedPeriod}
      />

      <CommercialProfilesTable
        rows={portfolio.rows}
        onDelete={handleDeleteLabourProfile}
        onDuplicate={handleDuplicateLabourProfile}
        selectedPeriod={selectedPeriod}
      />
    </main>
  );
}