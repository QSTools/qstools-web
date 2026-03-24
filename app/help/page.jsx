"use client";

import { useRouter } from "next/navigation";
import HelpHeader from "@/components/help/HelpHeader";
import HelpSidebar from "@/components/help/HelpSidebar";
import HelpSection from "@/components/help/HelpSection";
import FormulaGroup from "@/components/help/FormulaGroup";
import { helpSections } from "@/lib/constants/helpContent";
import { formulaGroups } from "@/lib/constants/formulaContent";
import { glossaryTerms } from "@/lib/constants/glossaryContent";

export default function HelpPage() {
  const router = useRouter();

  const navSections = [
    ...helpSections.map((section) => ({
      id: section.id,
      title: section.title,
    })),
    { id: "formula-reference", title: "Formula Reference" },
    { id: "glossary", title: "Glossary" },
  ];

  function handleBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/labour-rates");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-4">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted"
        >
          ← Back
        </button>
      </div>

      <HelpHeader />

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <HelpSidebar sections={navSections} />

        <main className="min-w-0 space-y-10">
          {helpSections.map((section) => (
            <HelpSection key={section.id} section={section} />
          ))}

          <section
            id="formula-reference"
            className="scroll-mt-24 space-y-6 rounded-2xl border border-border/60 bg-card p-6 shadow-sm"
          >
            <div className="space-y-2">
              <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Technical reference
              </p>
              <h2 className="text-2xl font-semibold tracking-tight">
                Formula Reference
              </h2>
              <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
                Use this section to understand how the main metrics are built,
                what inputs feed them, and how to interpret them in practice.
              </p>
            </div>

            <div className="space-y-4">
              {formulaGroups.map((group) => (
                <FormulaGroup key={group.id} group={group} />
              ))}
            </div>
          </section>

          <section
            id="glossary"
            className="scroll-mt-24 rounded-2xl border border-border/60 bg-card p-6 shadow-sm"
          >
            <div className="space-y-2">
              <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Definitions
              </p>
              <h2 className="text-2xl font-semibold tracking-tight">
                Glossary
              </h2>
              <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
                Quick definitions for the key commercial and labour terms used
                across the app.
              </p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {glossaryTerms.map((term) => (
                <div
                  key={term.term}
                  className="rounded-xl border border-border/60 bg-background p-4"
                >
                  <h3 className="text-sm font-semibold sm:text-base">
                    {term.term}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {term.definition}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}