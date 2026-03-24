"use client";

import { useState } from "react";

export default function InfoTooltip({ content }) {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative ml-1 inline-flex overflow-visible">
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-border bg-background text-[10px] font-bold text-muted-foreground hover:text-foreground"
        aria-label="More information"
      >
        i
      </button>

      {open && (
        <div
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          className="absolute left-1/2 top-full z-[9999] mt-2 w-80 -translate-x-1/2 rounded-md border border-border bg-background px-3 py-2 text-sm leading-5 text-foreground shadow-lg"
        >
          {content}
        </div>
      )}
    </span>
  );
}