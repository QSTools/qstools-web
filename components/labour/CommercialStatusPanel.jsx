"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { money, percent } from "@/lib/utils/formatters";
import { statusToneClasses } from "@/lib/utils/classHelpers";
import { statusIcon } from "@/lib/utils/statusHelpers";

export default function CommercialStatusPanel({
  effectiveCost,
  chargeoutRate,
  targetRate,
  marginPct,
  marginTier,
}) {
  const roundedChargeout = Number((chargeoutRate ?? 0).toFixed(2));
  const roundedEffectiveCost = Number((effectiveCost ?? 0).toFixed(2));
  const roundedTargetRate = Number((targetRate ?? 0).toFixed(2));

  const recoveryStatus =
    roundedChargeout < roundedEffectiveCost
      ? {
          label: "fail",
          text: "Below cost recovery",
          tone: "danger",
        }
      : roundedChargeout === roundedEffectiveCost
        ? {
            label: "pass",
            text: "Meets cost recovery",
            tone: "healthy",
          }
        : {
            label: "pass",
            text: "Above cost recovery",
            tone: "healthy",
          };

  const marginStatus =
    marginTier === "healthy"
      ? { label: "pass", text: "Healthy margin", tone: "healthy" }
      : marginTier === "caution"
        ? { label: "warn", text: "Tight margin", tone: "caution" }
        : marginTier === "warning"
          ? { label: "warn", text: "Below target margin", tone: "warning" }
          : { label: "fail", text: "Negative margin", tone: "danger" };

  const targetStatus =
    roundedChargeout < roundedTargetRate
      ? roundedChargeout >= roundedEffectiveCost
        ? {
            label: "warn",
            text: "Above cost but below target",
            tone: "warning",
          }
        : {
            label: "fail",
            text: "Below target and below cost",
            tone: "danger",
          }
      : roundedChargeout === roundedTargetRate
        ? {
            label: "pass",
            text: "Meets target rate",
            tone: "healthy",
          }
        : {
            label: "pass",
            text: "Above target rate",
            tone: "healthy",
          };

  let overall = {
    title: "Healthy",
    tone: "healthy",
    description:
      "This labour profile is commercially sound based on current settings.",
  };

  if (
    recoveryStatus.label === "fail" ||
    targetStatus.label === "fail" ||
    marginStatus.label === "fail"
  ) {
    overall = {
      title: "At Risk",
      tone: "danger",
      description:
        "This labour profile has a serious pricing issue and needs attention before use.",
    };
  } else if (
    recoveryStatus.label === "warn" ||
    targetStatus.label === "warn" ||
    marginStatus.label === "warn"
  ) {
    overall = {
      title: "Tight",
      tone: "warning",
      description:
        "This labour profile is workable but leaves limited room for pricing error or productivity loss.",
    };
  }

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle>Commercial Status</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div
          className={`rounded-xl border px-4 py-4 ${statusToneClasses(
            overall.tone
          )}`}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide opacity-80">
                Overall
              </div>
              <div className="mt-1 text-lg font-bold">{overall.title}</div>
              <p className="mt-1 text-sm">{overall.description}</p>
            </div>

            <div className="text-right text-sm font-medium">
              <div>Margin: {percent(marginPct)}</div>
              <div>Charge-Out: {money(chargeoutRate)}</div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div
            className={`rounded-lg border px-4 py-3 ${statusToneClasses(
              recoveryStatus.tone
            )}`}
          >
            <div className="text-xs font-semibold uppercase tracking-wide opacity-80">
              Recovery
            </div>
            <div className="mt-2 text-sm font-bold">
              {statusIcon(recoveryStatus.label)} {recoveryStatus.text}
            </div>
            <div className="mt-2 text-xs opacity-90">
              Effective Cost: {money(effectiveCost)}
            </div>
          </div>

          <div
            className={`rounded-lg border px-4 py-3 ${statusToneClasses(
              marginStatus.tone
            )}`}
          >
            <div className="text-xs font-semibold uppercase tracking-wide opacity-80">
              Margin
            </div>
            <div className="mt-2 text-sm font-bold">
              {statusIcon(marginStatus.label)} {marginStatus.text}
            </div>
            <div className="mt-2 text-xs opacity-90">
              Current Margin: {percent(marginPct)}
            </div>
          </div>

          <div
            className={`rounded-lg border px-4 py-3 ${statusToneClasses(
              targetStatus.tone
            )}`}
          >
            <div className="text-xs font-semibold uppercase tracking-wide opacity-80">
              Target Rate
            </div>
            <div className="mt-2 text-sm font-bold">
              {statusIcon(targetStatus.label)} {targetStatus.text}
            </div>
            <div className="mt-2 text-xs opacity-90">
              Target Rate: {money(targetRate)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}