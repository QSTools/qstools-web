import { formatCurrency } from "@/lib/calculations/overheadCalculations";

export default function SavedOverheadProfiles({
  profiles,
  onLoad,
  onDelete,
}) {
  return (
    <div className="rounded-2xl border bg-card p-6">
      <h2 className="mb-4 text-lg font-semibold">Saved Overhead Profiles</h2>

      <div className="space-y-3">
        {profiles.length === 0 && (
          <p className="text-sm text-muted-foreground">No profiles yet</p>
        )}

        {profiles.map((profile) => (
          <div
            key={profile.id}
            className="flex items-center justify-between rounded-xl border p-3"
          >
            <div>
              <div className="font-semibold">
                {profile.profileName || "Unnamed Profile"}
              </div>
              <div className="text-xs text-muted-foreground">
                {profile.staffName || "No staff name"} • {profile.role || "No role"}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                Annual overhead: {formatCurrency(profile.totalAnnualOverhead || 0)}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                Vehicle included: {profile.vehicleEnabled ? "Yes" : "No"}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onLoad(profile.id)}
                className="rounded-lg border px-3 py-1.5 text-sm hover:bg-accent"
              >
                Load
              </button>

              <button
                onClick={() => onDelete(profile.id)}
                className="text-sm text-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}