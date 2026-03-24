"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { flagClasses } from "@/lib/utils/classHelpers";

function getFlagIcon(type) {
  switch (type) {
    case "healthy":
      return "✅";
    case "danger":
      return "⛔";
    case "warning":
      return "⚠";
    case "caution":
      return "🟠";
    default:
      return "•";
  }
}

export default function FlagPanel({ flags = [] }) {
  if (!flags.length) {
    return (
      <Card className="border-green-300 bg-green-50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-green-700">Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm font-medium text-green-700">
            No immediate pricing risk flags detected for this labour profile.
          </p>
        </CardContent>
      </Card>
    );
  }

  const hasOnlyHealthyFlags = flags.every((flag) => flag.type === "healthy");

  return (
    <Card
      className={
        hasOnlyHealthyFlags
          ? "border-green-300 bg-green-50 shadow-sm"
          : "border-border/60 shadow-sm"
      }
    >
      <CardHeader>
        <CardTitle className={hasOnlyHealthyFlags ? "text-green-700" : ""}>
          {hasOnlyHealthyFlags ? "Status" : "Alerts & Flags"}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {flags.map((flag, index) => (
          <div
            key={`${flag.label}-${index}`}
            className={`rounded-lg border px-4 py-3 text-sm font-medium ${flagClasses(
              flag.type
            )}`}
          >
            <span className="mr-2">{getFlagIcon(flag.type)}</span>
            {flag.label}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}