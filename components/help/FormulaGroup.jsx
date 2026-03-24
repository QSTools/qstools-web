"use client";

import { useState } from "react";
import FormulaTable from "@/components/help/FormulaTable";

export default function FormulaGroup({ group }) {
  const [open, setOpen] = useState(group.defaultOpen ?? true);

  return (
    <div
      id={group.id}
      className="scroll-mt-24 rounded-2xl border border-border/60 bg-background"
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <div>
          <h3 className="text-base font-semibold sm:text-lg">{group.title}</h3>
          {group.description ? (
            <p className="mt-1 text-sm text-muted-foreground">
              {group.description}
            </p>
          ) : null}
        </div>

        <span className="shrink-0 text-sm font-medium text-muted-foreground">
          {open ? "Hide" : "Show"}
        </span>
      </button>

      {open ? (
        <div className="border-t border-border/60 p-5">
          <FormulaTable rows={group.rows} />
        </div>
      ) : null}
    </div>
  );
}