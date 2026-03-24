export default function HelpHeader() {
  return (
    <section className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm sm:p-8">
      <div className="max-w-4xl space-y-4">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          QS Tools Help Centre
        </p>

        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Understand the workflow, formulas, and commercial meaning behind the app
        </h1>

        <p className="text-sm text-muted-foreground sm:text-base">
          This Help Centre explains how to use the Labour, Employee Overheads,
          and Commercial pages together. It also documents the core formulas so
          your team can understand how each metric is built and how to use it
          for pricing, profitability, and decision-making.
        </p>

        <div className="grid gap-3 pt-2 sm:grid-cols-3">
          <div className="rounded-2xl border border-border/60 bg-background p-4">
            <h2 className="text-sm font-semibold">Use the workflow</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Learn the recommended order for setting up labour, overheads, and
              portfolio review.
            </p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-background p-4">
            <h2 className="text-sm font-semibold">Check the formulas</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              See what inputs feed the cards, summaries, and commercial outputs.
            </p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-background p-4">
            <h2 className="text-sm font-semibold">Interpret the outputs</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Understand flags, gaps, margins, and where the biggest commercial
              opportunities sit.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}