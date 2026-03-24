export default function EmployeeOverheadForm({
  form,
  labourProfiles,
  onChange,
  onLabourProfileSelect,
}) {
  return (
    <div className="space-y-4 rounded-2xl border bg-card p-6">
      <h2 className="text-lg font-semibold">
        {form.id ? "Edit Overhead Profile" : "New Profile"}
      </h2>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="md:col-span-4">
          <label className="mb-2 block text-sm font-medium">
            Select Saved Staff
          </label>
          <select
            value={form.labourProfileId}
            onChange={onLabourProfileSelect}
            className="w-full rounded-xl border px-3 py-2"
          >
            <option value="">Select a saved labour profile</option>
            {labourProfiles.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.staffName || "Unnamed Staff"}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Staff Name</label>
          <input
            name="staffName"
            placeholder="Staff Name"
            value={form.staffName}
            onChange={onChange}
            className="w-full rounded-xl border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Role</label>
          <input
            name="role"
            placeholder="Role"
            value={form.role}
            onChange={onChange}
            className="w-full rounded-xl border px-3 py-2"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium">Profile Name</label>
          <input
            name="profileName"
            placeholder="Profile Name"
            value={form.profileName}
            onChange={onChange}
            className="w-full rounded-xl border px-3 py-2"
          />
        </div>
      </div>
    </div>
  );
}