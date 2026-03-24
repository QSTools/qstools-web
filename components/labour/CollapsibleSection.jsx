"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
  storageKey,
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (!storageKey || typeof window === "undefined") {
      setIsHydrated(true);
      return;
    }

    const saved = window.localStorage.getItem(storageKey);

    if (saved === "true") setOpen(true);
    if (saved === "false") setOpen(false);

    setIsHydrated(true);
  }, [storageKey]);

  useEffect(() => {
    if (!isHydrated) return;
    if (!storageKey || typeof window === "undefined") return;

    window.localStorage.setItem(storageKey, String(open));
  }, [open, storageKey, isHydrated]);

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader
        className="cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      >
        <div className="flex items-center justify-between gap-4">
          <CardTitle>{title}</CardTitle>

          <button
            type="button"
            className="inline-flex h-8 items-center justify-center rounded-md border border-border bg-background px-3 text-xs font-medium text-muted-foreground hover:bg-muted"
            aria-expanded={open}
            aria-label={open ? `Collapse ${title}` : `Expand ${title}`}
            onClick={(e) => {
              e.stopPropagation();
              setOpen((prev) => !prev);
            }}
          >
            {open ? "Hide" : "Show"}
          </button>
        </div>
      </CardHeader>

      {open && <CardContent className="space-y-1">{children}</CardContent>}
    </Card>
  );
}