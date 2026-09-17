import { requireRole } from "@/lib/auth-helpers";
import { AnalyticsRepository } from "@/repositories/analytics-repository";
import { BarChartCard } from "@/components/analytics/bar-chart-card";

export default async function AnalyticsPage() {
  await requireRole(["ADMIN", "MANAGER"]);

  const [byStatus, byPriority, byCategory, byAssignee] = await Promise.all([
    AnalyticsRepository.getCountsByStatus(),
    AnalyticsRepository.getCountsByPriority(),
    AnalyticsRepository.getCountsByCategory(),
    AnalyticsRepository.getWorkloadByAssignee(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Analytics</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <BarChartCard title="Tickety wg statusu" data={byStatus} />
        <BarChartCard title="Tickety wg priorytetu" data={byPriority} />
        <BarChartCard title="Tickety wg kategorii" data={byCategory} />
        <BarChartCard title="Obciążenie zespołu" data={byAssignee} />
      </div>
    </div>
  );
}