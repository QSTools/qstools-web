import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center px-6 py-16">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-10">
          <h1 className="text-4xl font-semibold tracking-tight">QS Tools</h1>
          <p className="text-sm text-muted-foreground">
            Quantity surveying tools for estimating, pricing, and job analysis
          </p>
        </div>

        {/* Tool Cards */}
        <div className="grid w-full gap-6 md:grid-cols-2">
          
          {/* Piling Tool */}
          <Link href="/piling" className="group">
            <Card className="border-border/60 shadow-sm transition-all hover:shadow-md hover:border-ring/40">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Piling Tool
                  <span className="text-xs text-muted-foreground group-hover:text-foreground">
                    →
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Calculate pile quantities including concrete, cages, and pump
                requirements.
              </CardContent>
            </Card>
          </Link>

          {/* Labour Rates Tool */}
          <Link href="/labour-rates" className="group">
            <Card className="border-border/60 shadow-sm transition-all hover:shadow-md hover:border-ring/40">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Labour Rates
                  <span className="text-xs text-muted-foreground group-hover:text-foreground">
                    →
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Calculate labour cost, PAYE estimates, efficiency-adjusted recovery,
                and charge-out profitability.
              </CardContent>
            </Card>
          </Link>

        </div>
      </div>
    </main>
  );
}