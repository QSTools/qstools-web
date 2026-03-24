export default function HelpSidebar({ sections = [] }) {
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
        <p className="mb-3 text-sm font-semibold">On this page</p>

        <nav className="space-y-1">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              {section.title}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}