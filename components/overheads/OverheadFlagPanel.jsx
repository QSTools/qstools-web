import { getOverheadFlags } from "@/lib/calculations/overheadPageHelpers";
import { flagClasses } from "@/lib/utils/classHelpers";

export default function OverheadFlagPanel(props) {
  const flags = getOverheadFlags(props);

  return (
    <div className="rounded-2xl border bg-card p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Alerts & Flags</h2>
        <p className="text-sm text-muted-foreground">
          Quick checks to help validate whether this overhead profile looks commercially realistic.
        </p>
      </div>

      <div className="space-y-3">
        {flags.length === 0 && (
          <div className="rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground">
            No flags triggered.
          </div>
        )}

        {flags.map((flag, index) => (
          <div
            key={`${flag.title}-${index}`}
            className={`rounded-xl border p-4 ${flagClasses(flag.type)}`}
          >
            <div className="font-semibold">{flag.title}</div>
            <div className="mt-1 text-sm opacity-90">
              {flag.message}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}