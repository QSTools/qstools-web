"use client";

import React, { useMemo, useState } from "react";
import { Calculator, Drill, Layers } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

import {
  BAR_OPTIONS,
  MPA_OPTIONS,
  PUMP_OPTIONS,
  TIE_OPTIONS,
} from "@/lib/config/options";
import { num, round } from "@/lib/calculations/helpers";
import { calculateConcrete } from "@/lib/calculations/concrete";
import { calculatePumpRows } from "@/lib/calculations/pump";
import { calculateCage } from "@/lib/calculations/cage";
import { buildPilingOutput } from "@/lib/builders/buildPilingOutput";
import OutputSchedule from "./OutputSchedule";

function MetricCard({ label, value, subtext, className = "" }) {
  return (
    <div className={`rounded-xl border bg-background p-4 ${className}`}>
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
      {subtext ? (
        <div className="mt-2 text-sm text-muted-foreground">{subtext}</div>
      ) : null}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function ToggleField({ id, label, checked, onCheckedChange }) {
  return (
    <div className="flex items-center justify-between rounded-xl border bg-background px-4 py-3">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

export default function PilingForm() {
  const [form, setForm] = useState({
    piles: true,
    type: "Concrete",
    radius: "0.2",
    length: "1.5",
    sentonSize: "0",
    timberPileLengthOut: "0",
    quantity: "2",
    mpa: "25",
    pumpType: "No Pump",
    pilesCages: true,
    steelType: "HD12",
    qBars: "4",
    tieCenters: "0.15",
    tieType: "R6",
    sideCoverMm: "75",
    topBottomCoverMm: "75",
    concreteWastePct: "5",
    vibrationPct: "4",
    verticalBarHookAllowanceM: "0.2",
    cylinderTesting: false,
  });

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const results = useMemo(() => {
    const radius = num(form.radius);
    const length = num(form.length);
    const quantity = num(form.quantity);
    const qBars = num(form.qBars);
    const tieCenters = num(form.tieCenters);
    const sideCoverMm = num(form.sideCoverMm);
    const topBottomCoverMm = num(form.topBottomCoverMm);
    const wastePct = num(form.concreteWastePct) / 100;
    const vibrationPct = num(form.vibrationPct) / 100;
    const hookAllowance = num(form.verticalBarHookAllowanceM);

    const concrete = calculateConcrete({
      radius,
      length,
      quantity,
      wastePct,
      vibrationPct,
    });

    const pump = calculatePumpRows({
      pumpType: form.pumpType,
      concreteQty: concrete.roundedConcreteOrder,
    });

    const cage = calculateCage({
      radius,
      length,
      quantity,
      qBars,
      tieCenters,
      sideCoverMm,
      topBottomCoverMm,
      hookAllowance,
    });

    const reinforcingDescription = `${round(
      cage.cageDiameterMm,
      0
    )} Dia Spiral Cage with ${qBars} x ${form.steelType}`;

    const outputRows = buildPilingOutput({
      mpa: form.mpa,
      mix: pump.mix,
      roundedConcreteOrder: concrete.roundedConcreteOrder,
      pumpRows: pump.rows,
      hasSmallLoadCharge:
        concrete.roundedConcreteOrder > 0 && concrete.roundedConcreteOrder < 3,
      cylinderTesting: form.cylinderTesting,
      pilesCages: form.pilesCages,
      reinforcingDescription,
      quantity,
      steelType: form.steelType,
      tieType: form.tieType,
      totalVerticalBarLength: cage.totalVerticalBarLength,
      totalSpiralLength: cage.totalSpiralLength,
    });

    return {
      concrete,
      pump,
      cage,
      reinforcingDescription,
      outputRows,
    };
  }, [form]);

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        <div className="flex flex-col gap-3">
          <div className="inline-flex w-fit items-center rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            QS Tools · Piling
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Piling Calculator</h1>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
              Generate concrete quantities, cage requirements, and a quote-ready
              piling schedule from live project inputs.
            </p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[440px_minmax(0,1fr)]">
          <div className="space-y-6 xl:sticky xl:top-6 xl:h-fit">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Drill className="h-5 w-5" />
                  Input Data
                </CardTitle>
                <CardDescription>
                  Enter geometry, concrete settings, and reinforcing details.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <ToggleField
                    id="piles"
                    label="Piles"
                    checked={form.piles}
                    onCheckedChange={(value) => update("piles", value)}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Type">
                    <Select
                      value={form.type}
                      onValueChange={(value) => update("type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Concrete">Concrete</SelectItem>
                        <SelectItem value="Timber">Timber</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field label="Quantity">
                    <Input
                      value={form.quantity}
                      onChange={(e) => update("quantity", e.target.value)}
                    />
                  </Field>
                </div>

                <Separator />

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Radius (m)">
                    <Input
                      value={form.radius}
                      onChange={(e) => update("radius", e.target.value)}
                    />
                  </Field>

                  <Field label="Length / Depth (m)">
                    <Input
                      value={form.length}
                      onChange={(e) => update("length", e.target.value)}
                    />
                  </Field>

                  <Field label="Senton Size">
                    <Input
                      value={form.sentonSize}
                      onChange={(e) => update("sentonSize", e.target.value)}
                    />
                  </Field>

                  <Field label="Timber Pile Length Out (m)">
                    <Input
                      value={form.timberPileLengthOut}
                      onChange={(e) =>
                        update("timberPileLengthOut", e.target.value)
                      }
                    />
                  </Field>
                </div>

                <Separator />

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="mPa">
                    <Select
                      value={form.mpa}
                      onValueChange={(value) => update("mpa", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MPA_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field label="Pump / Line">
                    <Select
                      value={form.pumpType}
                      onValueChange={(value) => update("pumpType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PUMP_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field label="Mix">
                    <Input value={results.pump.mix} readOnly />
                  </Field>

                  <Field label="Concrete Variable (%)">
                    <Input
                      value={form.concreteWastePct}
                      onChange={(e) => update("concreteWastePct", e.target.value)}
                    />
                  </Field>

                  <Field label="Vibration Factor (%)">
                    <Input
                      value={form.vibrationPct}
                      onChange={(e) => update("vibrationPct", e.target.value)}
                    />
                  </Field>

                  <div className="sm:col-span-2">
                    <ToggleField
                      id="cylinderTesting"
                      label="Cylinder Testing"
                      checked={form.cylinderTesting}
                      onCheckedChange={(value) => update("cylinderTesting", value)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <ToggleField
                    id="pilesCages"
                    label="Pile Cages"
                    checked={form.pilesCages}
                    onCheckedChange={(value) => update("pilesCages", value)}
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Steel Type">
                      <Select
                        value={form.steelType}
                        onValueChange={(value) => update("steelType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {BAR_OPTIONS.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>

                    <Field label="Q Bars">
                      <Input
                        value={form.qBars}
                        onChange={(e) => update("qBars", e.target.value)}
                      />
                    </Field>

                    <Field label="Tie Type">
                      <Select
                        value={form.tieType}
                        onValueChange={(value) => update("tieType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TIE_OPTIONS.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>

                    <Field label="Tie Centers (m)">
                      <Input
                        value={form.tieCenters}
                        onChange={(e) => update("tieCenters", e.target.value)}
                      />
                    </Field>

                    <Field label="Side Cover (mm)">
                      <Input
                        value={form.sideCoverMm}
                        onChange={(e) => update("sideCoverMm", e.target.value)}
                      />
                    </Field>

                    <Field label="Top / Bottom Cover (mm)">
                      <Input
                        value={form.topBottomCoverMm}
                        onChange={(e) => update("topBottomCoverMm", e.target.value)}
                      />
                    </Field>

                    <Field label="Bar Hook Allowance (m)">
                      <Input
                        value={form.verticalBarHookAllowanceM}
                        onChange={(e) =>
                          update("verticalBarHookAllowanceM", e.target.value)
                        }
                      />
                    </Field>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Concrete Quantities
                </CardTitle>
                <CardDescription>
                  Live calculated concrete totals and order quantity.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr_0.9fr]">
                  <div className="rounded-xl border bg-primary p-5 text-primary-foreground">
                    <div className="text-xs font-medium uppercase tracking-wide opacity-80">
                      Rounded Concrete Order
                    </div>
                    <div className="mt-3 text-4xl font-semibold tracking-tight">
                      {results.concrete.roundedConcreteOrder.toFixed(1)} m³
                    </div>
                    <div className="mt-2 text-sm opacity-80">
                      {form.mpa} mPa · {results.pump.mix}
                    </div>
                  </div>

                  <MetricCard
                    label="Pile Diameter"
                    value={`${round(results.cage.pileDiameterMm, 0)} mm`}
                  />
                  <MetricCard
                    label="Volume per Pile"
                    value={`${round(results.concrete.pileVolumeEach)} m³`}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <MetricCard
                    label="Base Concrete"
                    value={`${round(results.concrete.baseConcrete)} m³`}
                  />
                  <MetricCard
                    label="With Variable + Vibration"
                    value={`${round(results.concrete.concreteWithAllAllowances)} m³`}
                  />
                  <MetricCard label="Pump Type" value={form.pumpType} />
                  <MetricCard label="Mix" value={results.pump.mix} />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Cage Quantities
                </CardTitle>
                <CardDescription>
                  Reinforcing cage dimensions and total steel lengths.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  <MetricCard
                    label="Calculated Cage Diameter"
                    value={`${round(results.cage.cageDiameterMm, 0)} mm`}
                  />
                  <MetricCard
                    label="Effective Cage Length"
                    value={`${round(results.cage.effectiveCageLengthM)} m`}
                  />
                  <MetricCard
                    label="Spiral Length per Cage"
                    value={`${round(results.cage.spiralLengthPerCage)} m`}
                  />
                  <MetricCard
                    label={`Total Spiral (${form.tieType})`}
                    value={`${round(results.cage.totalSpiralLength)} m`}
                  />
                  <MetricCard
                    label="Vertical Bar Length Each"
                    value={`${round(results.cage.verticalBarLengthEach)} m`}
                  />
                  <MetricCard
                    label={`Total ${form.steelType} Length`}
                    value={`${round(results.cage.totalVerticalBarLength)} m`}
                  />
                </div>

                <div className="rounded-xl border border-dashed bg-muted/40 p-4">
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Cage Description
                  </div>
                  <div className="mt-2 text-sm font-medium">
                    {results.reinforcingDescription}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Output Schedule</CardTitle>
                <CardDescription>
                  Quote-ready schedule generated from the current inputs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OutputSchedule rows={results.outputRows} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}