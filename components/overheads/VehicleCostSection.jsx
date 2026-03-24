"use client";

import { formatCurrency } from "@/lib/calculations/overheadCalculations";

function Field({ label, name, value, onChange, disabled = false, step = "0.01" }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>
      <input
        type="number"
        step={step}
        min="0"
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full rounded-xl border px-3 py-2 text-sm disabled:opacity-50"
      />
    </div>
  );
}

export default function VehicleCostSection({
  form,
  onChange,
  vehicle,
}) {
  const vehicleDisabled = !form.vehicleEnabled;
  const isCompanyVehicle = form.vehicleType === "company";

  return (
    <div className="rounded-2xl border bg-card p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Vehicle Cost (Per Employee)</h2>
        <p className="text-sm text-muted-foreground">
          Recover vehicle cost through labour. Cash costs are always included.
          Replacement allowance (depreciation) can be optionally included.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            name="vehicleEnabled"
            checked={Boolean(form.vehicleEnabled)}
            onChange={onChange}
          />
          Include Vehicle Costs
        </label>

        <div>
          <label className="mb-2 block text-sm font-medium">Vehicle Type</label>
          <div className="flex flex-wrap gap-4 rounded-xl border px-3 py-3 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="vehicleType"
                value="company"
                checked={form.vehicleType === "company"}
                onChange={onChange}
                disabled={vehicleDisabled}
              />
              Company Vehicle
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="vehicleType"
                value="fuelOnly"
                checked={form.vehicleType === "fuelOnly"}
                onChange={onChange}
                disabled={vehicleDisabled}
              />
              Fuel Card / Allowance Only
            </label>
          </div>
        </div>
      </div>

      {isCompanyVehicle ? (
        <div className="mt-6 space-y-6">
          <div className="rounded-xl border p-4">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Asset Details
            </h3>

            <div className="grid gap-4 md:grid-cols-3">
              <Field
                label="Purchase Price"
                name="vehiclePurchasePrice"
                value={form.vehiclePurchasePrice}
                onChange={onChange}
                disabled={vehicleDisabled}
              />
              <Field
                label="Residual Value"
                name="vehicleResidualValue"
                value={form.vehicleResidualValue}
                onChange={onChange}
                disabled={vehicleDisabled}
              />
              <Field
                label="Useful Life (Years)"
                name="vehicleUsefulLifeYears"
                value={form.vehicleUsefulLifeYears}
                onChange={onChange}
                disabled={vehicleDisabled}
                step="1"
              />
            </div>

            <div className="mt-4 space-y-3 rounded-xl border bg-muted/30 p-3 text-sm">
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  Annual Depreciation
                </div>
                <div className="mt-1 font-semibold">
                  {formatCurrency(vehicle.depreciationAnnual)}
                </div>
              </div>

              <label className="flex items-start gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  name="includeVehicleReplacementAllowance"
                  checked={Boolean(form.includeVehicleReplacementAllowance)}
                  onChange={onChange}
                  disabled={vehicleDisabled}
                  className="mt-1"
                />
                <span>
                  Include replacement allowance
                  <span
                    className="ml-1 cursor-help text-xs text-muted-foreground"
                    title="Replacement allowance is the annual value loss of the vehicle spread over its useful life. It is not a cash payment today. It is a recovery allowance to fund future replacement. This is also commonly called depreciation."
                  >
                    ?
                  </span>
                </span>
              </label>

              <div className="text-xs text-muted-foreground">
                Included in cost:{" "}
                <span className="font-semibold text-foreground">
                  {formatCurrency(
                    form.includeVehicleReplacementAllowance
                      ? vehicle.replacementAllowanceAnnual
                      : 0
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border p-4">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Finance
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Loan Amount"
                name="vehicleLoanAmount"
                value={form.vehicleLoanAmount}
                onChange={onChange}
                disabled={vehicleDisabled}
              />
              <Field
                label="Interest Rate (%)"
                name="vehicleInterestRate"
                value={form.vehicleInterestRate}
                onChange={onChange}
                disabled={vehicleDisabled}
              />
            </div>

            <div className="mt-4 rounded-xl border bg-muted/30 p-3 text-sm">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                Annual Interest
              </div>
              <div className="mt-1 font-semibold">
                {formatCurrency(vehicle.interestAnnual)}
              </div>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              Interest is included as a cost. Principal is excluded because
              replacement allowance / depreciation already accounts for asset usage
              when that option is turned on.
            </p>
          </div>

          <div className="rounded-xl border p-4">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Fixed Annual Costs
            </h3>

            <div className="grid gap-4 md:grid-cols-4">
              <Field
                label="Insurance"
                name="vehicleInsurance"
                value={form.vehicleInsurance}
                onChange={onChange}
                disabled={vehicleDisabled}
              />
              <Field
                label="Rego"
                name="vehicleRego"
                value={form.vehicleRego}
                onChange={onChange}
                disabled={vehicleDisabled}
              />
              <Field
                label="COF / WOF"
                name="vehicleCofWof"
                value={form.vehicleCofWof}
                onChange={onChange}
                disabled={vehicleDisabled}
              />
              <Field
                label="RUC / Diesel Mileage"
                name="vehicleRuc"
                value={form.vehicleRuc}
                onChange={onChange}
                disabled={vehicleDisabled}
              />
            </div>
          </div>

          <div className="rounded-xl border p-4">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Running Costs
            </h3>

            <div className="grid gap-4 md:grid-cols-3">
              <Field
                label="Fuel (Annual)"
                name="vehicleFuel"
                value={form.vehicleFuel}
                onChange={onChange}
                disabled={vehicleDisabled}
              />
              <Field
                label="Maintenance"
                name="vehicleMaintenance"
                value={form.vehicleMaintenance}
                onChange={onChange}
                disabled={vehicleDisabled}
              />
              <Field
                label="Tyres / Repairs"
                name="vehicleTyresRepairs"
                value={form.vehicleTyresRepairs}
                onChange={onChange}
                disabled={vehicleDisabled}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-xl border p-4">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Fuel Card / Allowance Only
          </h3>

          <div className="grid gap-4 md:grid-cols-3">
            <Field
              label="Fuel"
              name="fuelOnlyFuel"
              value={form.fuelOnlyFuel}
              onChange={onChange}
              disabled={vehicleDisabled}
            />
            <Field
              label="Vehicle Allowance"
              name="fuelOnlyAllowance"
              value={form.fuelOnlyAllowance}
              onChange={onChange}
              disabled={vehicleDisabled}
            />
            <Field
              label="Maintenance Contribution"
              name="fuelOnlyMaintenanceContribution"
              value={form.fuelOnlyMaintenanceContribution}
              onChange={onChange}
              disabled={vehicleDisabled}
            />
          </div>
        </div>
      )}

      <div className="mt-6 rounded-xl border p-4">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Recovery Basis
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Choose which hours to spread the vehicle cost across.
            </p>
          </div>

          <div
            className="max-w-sm rounded-xl border bg-muted/30 px-3 py-2 text-xs text-muted-foreground"
            title="Productive hours spreads vehicle cost over chargeable time only. Paid hours spreads it over all paid time. Use productive hours for pricing."
          >
            ?
          </div>
        </div>

        <div className="flex flex-wrap gap-4 rounded-xl border px-3 py-3 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="vehicleRecoveryBasis"
              value="productive"
              checked={form.vehicleRecoveryBasis === "productive"}
              onChange={onChange}
              disabled={vehicleDisabled}
            />
            Productive Hours
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="vehicleRecoveryBasis"
              value="paid"
              checked={form.vehicleRecoveryBasis === "paid"}
              onChange={onChange}
              disabled={vehicleDisabled}
            />
            Paid Hours
          </label>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          Productive hours recover cost only across billable time. Paid hours
          spread cost across all paid time. Use productive hours for pricing.
        </p>
      </div>

      <div className="mt-6 rounded-xl border bg-muted/30 p-4">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Vehicle Summary
        </h3>

        <div className="space-y-2 text-sm">
          {vehicle.vehicleLineItems.length === 0 ? (
            <div className="text-muted-foreground">No vehicle costs included.</div>
          ) : (
            vehicle.vehicleLineItems.map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-4">
                <span>{item.label}</span>
                <span className="font-medium">{formatCurrency(item.value)}</span>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 grid gap-4 border-t pt-4 md:grid-cols-4">
          <div className="rounded-xl border bg-background p-3">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              Paid Hours / Year
            </div>
            <div className="mt-1 font-semibold">
              {vehicle.paidHoursPerYear.toFixed(2)}
            </div>
          </div>

          <div className="rounded-xl border bg-background p-3">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              Productive Hours / Year
            </div>
            <div className="mt-1 font-semibold">
              {vehicle.productiveHoursPerYear.toFixed(2)}
            </div>
          </div>

          <div className="rounded-xl border bg-background p-3">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              Vehicle Cost / Year
            </div>
            <div className="mt-1 font-semibold">
              {formatCurrency(vehicle.vehicleAnnualCost)}
            </div>
          </div>

          <div className="rounded-xl border bg-background p-3">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              Vehicle Cost / Hr
            </div>
            <div className="mt-1 font-semibold">
              {formatCurrency(vehicle.vehicleCostPerHour)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}