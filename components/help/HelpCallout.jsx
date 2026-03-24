const toneClasses = {
  info: "border-blue-200 bg-blue-50 text-blue-900",
  success: "border-green-200 bg-green-50 text-green-900",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  neutral: "border-border/60 bg-muted/40 text-foreground",
};

export default function HelpCallout({
  title,
  children,
  tone = "neutral",
}) {
  return (
    <div className={`rounded-2xl border p-4 ${toneClasses[tone] || toneClasses.neutral}`}>
      {title ? <h3 className="text-sm font-semibold">{title}</h3> : null}
      <p className="mt-1 text-sm leading-6">{children}</p>
    </div>
  );
}