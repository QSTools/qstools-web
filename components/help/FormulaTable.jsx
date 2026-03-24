export default function FormulaTable({ rows = [] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border/60">
      <table className="min-w-full border-collapse text-sm">
        <thead className="bg-muted/50">
          <tr className="text-left">
            <th className="px-4 py-3 font-semibold">Metric</th>
            <th className="px-4 py-3 font-semibold">Formula</th>
            <th className="px-4 py-3 font-semibold">Inputs</th>
            <th className="px-4 py-3 font-semibold">Meaning</th>
            <th className="px-4 py-3 font-semibold">Notes</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr
              key={`${row.metric}-${index}`}
              className="border-t border-border/60 align-top"
            >
              <td className="px-4 py-3 font-medium">{row.metric}</td>
              <td className="px-4 py-3 text-muted-foreground">{row.formula}</td>
              <td className="px-4 py-3 text-muted-foreground">{row.inputs}</td>
              <td className="px-4 py-3 text-muted-foreground">{row.meaning}</td>
              <td className="px-4 py-3 text-muted-foreground">{row.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}