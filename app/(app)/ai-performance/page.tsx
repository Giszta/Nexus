import { requireRole } from "@/lib/auth-helpers";
import { AIPerformanceRepository } from "@/repositories/ai-performance-repository";
import { StatCard } from "@/components/analytics/stat-card";

function formatRate(rate: number | null): string {
  return rate === null ? "—" : `${Math.round(rate * 100)}%`;
}

export default async function AIPerformancePage() {
  await requireRole(["ADMIN", "MANAGER"]);

  const [usage, analysisFeedback, suggestionFeedback, overallFeedback, timeSaved] =
    await Promise.all([
      AIPerformanceRepository.getUsageSummary(),
      AIPerformanceRepository.getFeedbackRates("ANALYSIS"),
      AIPerformanceRepository.getFeedbackRates("SUGGESTION"),
      AIPerformanceRepository.getFeedbackRates(),
      AIPerformanceRepository.getEstimatedTimeSaved(),
    ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">AI Performance</h1>
        <p className="text-sm text-muted-foreground">
          Metryki oparte na rzeczywistych danych z aplikacji.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Classification accuracy"
          value={formatRate(analysisFeedback.acceptedRate)}
          caption={`Przybliżenie: % analiz zaakceptowanych bez korekty (n=${analysisFeedback.total})`}
        />
        <StatCard
          label="Suggestion acceptance"
          value={formatRate(suggestionFeedback.acceptedRate)}
          caption={`n=${suggestionFeedback.total} zrecenzowanych sugestii`}
        />
        <StatCard
          label="Human correction"
          value={formatRate(overallFeedback.editedRate)}
          caption={`n=${overallFeedback.total} wszystkich decyzji`}
        />
        <StatCard
          label="Average response time"
          value={`${(usage.avgLatency / 1000).toFixed(1)}s`}
          caption={`Na podstawie ${usage.totalRequests} zapytań AI`}
        />
        <StatCard
          label="Estimated time saved"
          value={
            timeSaved.minutesSaved >= 60
              ? `${(timeSaved.minutesSaved / 60).toFixed(1)}h`
              : `${timeSaved.minutesSaved}min`
          }
          caption={`Założenie: ${timeSaved.assumedManualMinutes}min ręcznie vs ${timeSaved.assumedReviewMinutes}min z AI, dla ${timeSaved.usedSuggestions} użytych sugestii`}
        />
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">AI Cost</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Requests" value={usage.totalRequests.toString()} />
          <StatCard
            label="Tokens"
            value={(usage.totalInputTokens + usage.totalOutputTokens).toLocaleString("pl-PL")}
          />
          <StatCard
            label="Estimated cost"
            value={`$${usage.totalCost.toFixed(4)}`}
            caption="Nie uwzględnia kosztu embeddingów (Voyage) — patrz Known Issues"
          />
        </div>
      </div>
    </div>
  );
}