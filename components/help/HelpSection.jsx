import HelpCallout from "@/components/help/HelpCallout";

export default function HelpSection({ section }) {
  return (
    <section
      id={section.id}
      className="scroll-mt-24 rounded-2xl border border-border/60 bg-card p-6 shadow-sm"
    >
      <div className="space-y-2">
        {section.eyebrow ? (
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {section.eyebrow}
          </p>
        ) : null}

        <h2 className="text-2xl font-semibold tracking-tight">{section.title}</h2>

        {section.intro ? (
          <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
            {section.intro}
          </p>
        ) : null}
      </div>

      {section.callout ? (
        <div className="mt-5">
          <HelpCallout
            title={section.callout.title}
            tone={section.callout.tone}
          >
            {section.callout.body}
          </HelpCallout>
        </div>
      ) : null}

      {section.paragraphs?.length ? (
        <div className="mt-6 space-y-4">
          {section.paragraphs.map((paragraph, index) => (
            <p key={index} className="text-sm leading-6 text-foreground/90 sm:text-base">
              {paragraph}
            </p>
          ))}
        </div>
      ) : null}

      {section.steps?.length ? (
        <ol className="mt-6 space-y-3">
          {section.steps.map((step, index) => (
            <li
              key={index}
              className="flex gap-3 rounded-xl border border-border/60 bg-background p-4"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border/60 text-sm font-semibold">
                {index + 1}
              </span>
              <span className="text-sm text-foreground/90 sm:text-base">{step}</span>
            </li>
          ))}
        </ol>
      ) : null}

      {section.bullets?.length ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {section.bullets.map((item, index) => (
            <div
              key={index}
              className="rounded-xl border border-border/60 bg-background p-4"
            >
              <p className="text-sm text-foreground/90 sm:text-base">{item}</p>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}