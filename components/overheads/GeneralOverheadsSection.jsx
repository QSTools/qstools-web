import {
  formatCurrency,
  toAnnual,
} from "@/lib/calculations/overheadCalculations";
import { OVERHEAD_ITEMS } from "@/lib/constants/overheadConfig";

export default function GeneralOverheadsSection({
  form,
  onChange,
  generalAnnualOverhead,
}) {
  return (
    <div className="rounded-2xl border bg-card p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">General Employee Overheads</h2>
        <p className="text-sm text-muted-foreground">
          Enter the cost frequency and amount. Everything is converted to an
          annual value automatically.
        </p>
      </div>

      <div className="space-y-3">
        {OVERHEAD_ITEMS.map((item) => {
          const enabledKey = `${item.key}Enabled`;
          const frequencyKey = `${item.key}Frequency`;
          const amountKey = `${item.key}Amount`;

          const enabled = form[enabledKey];
          const frequency = form[frequencyKey];
          const amount = form[amountKey];
          const annualAmount = enabled ? toAnnual(amount, frequency) : 0;

          return (
            <div
              key={item.key}
              className="grid gap-3 rounded-xl border p-4 md:grid-cols-[0.7fr_1.2fr_1fr_1fr_1fr]"
            >
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  name={enabledKey}
                  checked={enabled}
                  onChange={onChange}
                />
                {item.label}
              </label>

              <select
                name={frequencyKey}
                value={frequency}
                onChange={onChange}
                disabled={!enabled}
                className="w-full rounded-xl border px-3 py-2 text-sm disabled:opacity-50"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>

              <input
                type="number"
                step="0.01"
                min="0"
                name={amountKey}
                value={amount}
                onChange={onChange}
                disabled={!enabled}
                placeholder="0.00"
                className="w-full rounded-xl border px-3 py-2 text-sm disabled:opacity-50"
              />

              <div className="rounded-xl border bg-muted/30 px-3 py-2 text-sm">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  Annual
                </div>
                <div className="font-semibold">
                  {formatCurrency(annualAmount)}
                </div>
              </div>

              <div className="flex items-center justify-end">
                <span className="text-xs text-muted-foreground">
                  {enabled ? "Included" : "Not included"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 rounded-xl border bg-muted/30 p-4">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">
          General Overheads
        </div>
        <div className="mt-1 text-xl font-semibold">
          {formatCurrency(generalAnnualOverhead)}
        </div>
      </div>
    </div>
  );
}