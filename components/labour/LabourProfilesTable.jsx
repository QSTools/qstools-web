"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import InfoTooltip from "@/components/ui/info-tooltip";

function money(value) {
  return new Intl.NumberFormat("en-NZ", {
    style: "currency",
    currency: "NZD",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

function number(value) {
  return new Intl.NumberFormat("en-NZ", {
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

function percent(value) {
  return `${number(value)}%`;
}

function safeNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function calculateRecommendedRate(cost, marginPct) {
  const m = safeNumber(marginPct) / 100;
  if (m >= 1 || cost <= 0) return 0;
  return cost / (1 - m);
}

/* 🔥 NEW — aligned with commercial panel */
function calculateProfileMetrics(profile) {
  const r = profile?.results;
  if (!r) return null;

  const recoveredHours = safeNumber(r?.leave?.recoveredHoursPerYear);

  const labourRecovered =
    safeNumber(r?.loaded?.effectiveRecoveredCostPerHourBeforeOverheads);

  const trueCost = safeNumber(r?.loaded?.effectiveRecoveredCostPerHour);

  const overhead = trueCost - labourRecovered;

  const chargeout = safeNumber(r?.profit?.chargeoutRate);
  const profitPerHour = safeNumber(r?.profit?.profitPerHour);

  const marginPct = safeNumber(r?.profit?.marginPct);
  const targetMarginPct = safeNumber(r?.profit?.targetMarginPct || 20);

  const annualRevenue = chargeout * recoveredHours;
  const annualCost = trueCost * recoveredHours;
  const annualProfit = profitPerHour * recoveredHours;

  const targetRate = calculateRecommendedRate(trueCost, targetMarginPct);

  return {
    recoveredHours,
    labourRecovered,
    overhead,
    trueCost,
    chargeout,
    profitPerHour,
    marginPct,
    annualRevenue,
    annualCost,
    annualProfit,
    targetRate,
    targetMarginPct,
  };
}

function valueClass(value) {
  return safeNumber(value) < 0 ? "font-bold text-red-600" : "font-medium";
}

function marginClass(value) {
  const v = safeNumber(value);
  if (v < 0) return "font-bold text-red-600";
  if (v < 10) return "font-bold text-orange-600";
  if (v < 20) return "font-bold text-yellow-600";
  return "font-bold text-green-600";
}

export default function LabourProfilesTable({
  profiles = [],
  onEdit,
  onDelete,
  onDuplicate,
}) {
  if (!profiles.length) return null;

  const validProfiles = profiles.filter((p) => p?.results);

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle>Saved Labour Profiles</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1400px] text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Role</th>

                <th className="px-3 py-2">TEC / Hr</th>
                <th className="px-3 py-2">Overhead</th>
                <th className="px-3 py-2">True Cost</th>

                <th className="px-3 py-2">Charge-Out</th>
                <th className="px-3 py-2">Target Rate</th>

                <th className="px-3 py-2">Profit / Hr</th>
                <th className="px-3 py-2">Margin</th>

                <th className="px-3 py-2">Annual Cost</th>
                <th className="px-3 py-2">Annual Profit</th>

                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {validProfiles.map((profile) => {
                const m = calculateProfileMetrics(profile);
                if (!m) return null;

                return (
                  <tr key={profile.id} className="border-b hover:bg-muted/30">
                    <td className="px-3 py-3 font-semibold">
                      {profile.staffName}
                    </td>
                    <td className="px-3 py-3">{profile.role}</td>

                    <td className="px-3 py-3">{money(m.labourRecovered)}</td>
                    <td className="px-3 py-3">{money(m.overhead)}</td>
                    <td className="px-3 py-3 font-semibold">
                      {money(m.trueCost)}
                    </td>

                    <td className="px-3 py-3">{money(m.chargeout)}</td>
                    <td className="px-3 py-3">
                      {money(m.targetRate)}
                    </td>

                    <td className={`px-3 py-3 ${valueClass(m.profitPerHour)}`}>
                      {money(m.profitPerHour)}
                    </td>

                    <td className={`px-3 py-3 ${marginClass(m.marginPct)}`}>
                      {percent(m.marginPct)}
                    </td>

                    <td className="px-3 py-3">{money(m.annualCost)}</td>
                    <td className={`px-3 py-3 ${valueClass(m.annualProfit)}`}>
                      {money(m.annualProfit)}
                    </td>

                    <td className="px-3 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => onEdit(profile)}>Edit</button>
                        <button onClick={() => onDuplicate(profile)}>
                          Duplicate
                        </button>
                        <button onClick={() => onDelete(profile.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <Separator />
      </CardContent>
    </Card>
  );
}