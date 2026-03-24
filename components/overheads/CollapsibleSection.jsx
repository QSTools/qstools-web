"use client";

import { useState } from "react";

export default function CollapsibleSection({
  title,
  description,
  defaultOpen = true,
  children,
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="rounded-2xl border bg-card">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
      >
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        <span className="text-sm font-medium text-muted-foreground">
          {isOpen ? "Hide" : "Show"}
        </span>
      </button>

      {isOpen && <div className="px-6 pb-6">{children}</div>}
    </div>
  );
}