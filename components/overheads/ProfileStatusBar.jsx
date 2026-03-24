import {
  getOverheadFlags,
  getProfileStatus,
} from "@/lib/calculations/overheadPageHelpers";
import { statusToneClasses } from "@/lib/utils/classHelpers";

function getStatusTone({ form, flags }) {
  if (form?.id) {
    return "healthy";
  }

  const hasWarning = flags.some(
    (flag) => flag.type === "danger" || flag.type === "warning"
  );
  if (hasWarning) return "warning";

  const hasCaution = flags.some((flag) => flag.type === "caution");
  if (hasCaution) return "caution";

  return "default";
}

export default function ProfileStatusBar({
  form,
  selectedLabourProfile,
  summary,
}) {
  const status = getProfileStatus({
    form,
    selectedLabourProfile,
  });

  const flags = getOverheadFlags({
    totalAnnualOverhead: summary?.totalAnnualOverhead,
    totalOverheadPerHour: summary?.totalOverheadPerHour,
    generalAnnualOverhead: summary?.generalAnnualOverhead,
    vehicleAnnualCost: summary?.vehicle?.vehicleAnnualCost,
    generalPct: summary?.generalPct,
    vehiclePct: summary?.vehiclePct,
    vehicleEnabled: form?.vehicleEnabled,
  });

  const tone = getStatusTone({ form, flags });

  return (
    <div className={`rounded-2xl border p-4 ${statusToneClasses(tone)}`}>
      <div className="flex flex-col gap-1">
        <div className="text-sm font-semibold">{status.heading}</div>
        <div className="text-xs opacity-90">{status.subheading}</div>
      </div>
    </div>
  );
}