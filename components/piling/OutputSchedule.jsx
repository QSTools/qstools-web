export default function OutputSchedule({ rows }) {
  const hasRows = rows.length > 0;

  return (
    <div className="overflow-hidden rounded-xl border bg-background">
      <div className="border-b bg-muted/40 px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-foreground">
              Quote Schedule
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              Generated output items based on the current piling inputs
            </div>
          </div>

          <div className="rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            {rows.length} {rows.length === 1 ? "row" : "rows"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[56px_minmax(0,1fr)_120px_100px] border-b bg-muted/20 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <div>#</div>
        <div>Description</div>
        <div className="text-right">Qty</div>
        <div>Unit</div>
      </div>

      {!hasRows ? (
        <div className="px-5 py-10 text-sm text-muted-foreground">
          No output rows generated yet.
        </div>
      ) : (
        <div>
          {rows.map((row, index) => (
            <div
              key={`${row.description}-${index}`}
              className="grid grid-cols-[56px_minmax(0,1fr)_120px_100px] items-center border-b px-5 py-4 text-sm last:border-b-0 hover:bg-muted/20"
            >
              <div className="text-xs font-medium text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="pr-4 text-foreground">
                <div className="font-medium leading-5">{row.description}</div>
              </div>

              <div className="text-right font-semibold text-foreground">
                {row.qty}
              </div>

              <div className="text-muted-foreground">{row.unit}</div>
            </div>
          ))}
        </div>
      )}

      {hasRows ? (
        <div className="border-t bg-muted/30 px-5 py-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total schedule items</span>
            <span className="font-semibold text-foreground">{rows.length}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}