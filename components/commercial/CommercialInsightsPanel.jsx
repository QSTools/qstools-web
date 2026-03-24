"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function toneClass(tone) {
  switch (tone) {
    case "healthy":
      return "border-green-300 bg-green-50 text-green-700";
    case "warning":
      return "border-orange-300 bg-orange-50 text-orange-700";
    case "danger":
      return "border-red-300 bg-red-50 text-red-700";
    default:
      return "border-border bg-background text-foreground";
  }
}

function metricValueClass(tone) {
  switch (tone) {
    case "healthy":
      return "text-green-700";
    case "warning":
      return "text-orange-700";
    case "danger":
      return "text-red-700";
    default:
      return "text-foreground";
  }
}

function SummaryPersonCard({ title, person, emptyText }) {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {person ? (
          <div className="space-y-1">
            <div className="text-lg font-semibold">{person.name}</div>
            <div className="text-sm text-muted-foreground">
              Margin: {person.marginText} · Profit: {person.profitText}
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">{emptyText}</div>
        )}
      </CardContent>
    </Card>
  );
}

export default function CommercialInsightsPanel({ insightsData }) {
  const metrics = insightsData?.metrics || [];
  const topPerformer = insightsData?.topPerformer || null;
  const biggestImprovementOpportunity =
    insightsData?.biggestImprovementOpportunity || null;
  const alerts = insightsData?.alerts || [];
  const story = insightsData?.story || [];
  const recommendations = insightsData?.recommendations || [];

  const priorityAction =
    recommendations.find((item) => item.key === "target-rate") ||
    recommendations.find((item) => item.key === "break-even") ||
    recommendations[0] ||
    null;

  const remainingRecommendations = priorityAction
    ? recommendations.filter((item) => item.key !== priorityAction.key)
    : recommendations;

  return (
    <section className="space-y-6">
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle>Commercial Intelligence</CardTitle>
          <p className="text-sm text-muted-foreground">
            Decision-focused summary across your saved labour portfolio.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <div
                key={metric.key}
                className="rounded-xl border border-border/60 bg-muted/20 p-4"
              >
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {metric.label}
                </div>
                <div
                  className={`mt-2 text-2xl font-bold ${metricValueClass(
                    metric.tone
                  )}`}
                >
                  {metric.value}
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <SummaryPersonCard
              title="Top Performer"
              person={topPerformer}
              emptyText="No profiles available yet."
            />

            <SummaryPersonCard
              title="Biggest Improvement Opportunity"
              person={biggestImprovementOpportunity}
              emptyText="No profiles available yet."
            />
          </div>

          {priorityAction && (
            <Card className="border-border/60 shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Priority Action</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`rounded-xl border px-4 py-3 ${toneClass(
                    priorityAction.tone
                  )}`}
                >
                  <div className="text-sm font-semibold">
                    {priorityAction.label}
                  </div>
                  <div className="mt-1 text-sm">{priorityAction.text}</div>
                  <div className="mt-1 text-xs opacity-80">
                    {priorityAction.impact}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="border-border/60 shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  Actions & Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {remainingRecommendations.length ? (
                  <div className="space-y-3">
                    {remainingRecommendations.map((item) => (
                      <div
                        key={item.key}
                        className={`rounded-xl border px-4 py-3 ${toneClass(
                          item.tone
                        )}`}
                      >
                        <div className="text-sm font-semibold">{item.label}</div>
                        <div className="mt-1 text-sm">{item.text}</div>
                        <div className="mt-1 text-xs opacity-80">
                          {item.impact}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No additional commercial actions detected.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/60 shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Alerts & Flags</CardTitle>
              </CardHeader>
              <CardContent>
                {alerts.length ? (
                  <div className="space-y-2">
                    {alerts.map((alert, index) => (
                      <div
                        key={`${alert}-${index}`}
                        className="rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-orange-700"
                      >
                        {alert}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No major alerts detected across the current portfolio.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="border-border/60 shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Business Story</CardTitle>
            </CardHeader>
            <CardContent>
              {story.length ? (
                <div className="space-y-1">
                  {story.map((line, index) => (
                    <p key={index} className="m-0 text-sm text-muted-foreground">
                      {line}
                    </p>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No story available yet.
                </div>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </section>
  );
}