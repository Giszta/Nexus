import Link from "next/link";
import { getServerSession } from "@/lib/session";
import { DashboardRepository } from "@/repositories/dashboard-repository";
import { AnalyticsRepository } from "@/repositories/analytics-repository";
import { StatCard } from "@/components/analytics/stat-card";
import { BarChartCard } from "@/components/analytics/bar-chart-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Mic, Plus, Upload } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession();
  const role = (session?.user as { role?: string })?.role ?? "VIEWER";
  const canManage = role === "ADMIN" || role === "MANAGER" || role === "AGENT";
  const canSeeAI = role === "ADMIN" || role === "MANAGER";

  const [summary, byStatus, aiHighlights] = await Promise.all([
    DashboardRepository.getSummary(session!.user.id, role),
    AnalyticsRepository.getCountsByStatus(),
    canSeeAI ? DashboardRepository.getAIHighlights() : Promise.resolve(null),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            Witaj, {session?.user.name?.split(" ")[0]}
          </h1>
          <p className="text-sm text-muted-foreground">Skrót Twojej pracy w NEXUS.</p>
        </div>
        {canManage && (
          <div className="flex gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href="/tickets/voice"><Mic className="size-4" /> Głosowy</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/knowledge-base/new"><Upload className="size-4" /> Dokument</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/tickets/new"><Plus className="size-4" /> Nowy ticket</Link>
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Otwarte tickety" value={summary.openTickets.toString()} />
        {canManage && (
          <>
            <StatCard label="Przypisane do mnie" value={summary.myAssignedTickets.toString()} />
            <StatCard label="Oczekuje w AI Inbox" value={summary.pendingReviewCount.toString()} />
          </>
        )}
        {canSeeAI && aiHighlights && (
          <StatCard
            label="AI Acceptance"
            value={aiHighlights.acceptanceRate !== null ? `${aiHighlights.acceptanceRate}%` : "—"}
            caption={`${aiHighlights.totalRequests} zapytań AI łącznie`}
          />
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <BarChartCard title="Tickety wg statusu" data={byStatus} />

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Najnowsze tickety</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {summary.recentTickets.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between text-sm">
                <Link href={`/tickets/${ticket.id}`} className="hover:underline">
                  {ticket.title}
                </Link>
                <Badge variant="outline">{ticket.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}