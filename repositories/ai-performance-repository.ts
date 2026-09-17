import { prisma } from "@/lib/prisma";
import { estimateCost } from "@/lib/ai/pricing";
import type { FeedbackTargetType } from "@prisma/client";

export const AIPerformanceRepository = {
  async getUsageSummary() {
    const [analyses, suggestions] = await Promise.all([
      prisma.aIAnalysis.findMany({
        select: { model: true, inputTokens: true, outputTokens: true, latencyMs: true },
      }),
      prisma.aISuggestion.findMany({
        select: { model: true, inputTokens: true, outputTokens: true, latencyMs: true },
      }),
    ]);

    const all = [...analyses, ...suggestions];
    const totalRequests = all.length;
    const totalInputTokens = all.reduce((sum, r) => sum + (r.inputTokens ?? 0), 0);
    const totalOutputTokens = all.reduce((sum, r) => sum + (r.outputTokens ?? 0), 0);
    const totalCost = all.reduce(
      (sum, r) => sum + estimateCost(r.model, r.inputTokens ?? 0, r.outputTokens ?? 0),
      0
    );
    const avgLatency =
      totalRequests > 0
        ? Math.round(all.reduce((sum, r) => sum + r.latencyMs, 0) / totalRequests)
        : 0;

    return { totalRequests, totalInputTokens, totalOutputTokens, totalCost, avgLatency };
  },

async getFeedbackRates(targetType?: FeedbackTargetType) {
  const feedback = await prisma.aIFeedback.groupBy({
    by: ["decision"],
    where: targetType ? { targetType } : undefined,
    _count: true,
  });

    const total = feedback.reduce((sum, f) => sum + f._count, 0);
    const counts = { ACCEPTED: 0, EDITED: 0, REJECTED: 0 };
    feedback.forEach((f) => {
      counts[f.decision] = f._count;
    });

    return {
      total,
      acceptedRate: total > 0 ? counts.ACCEPTED / total : null,
      editedRate: total > 0 ? counts.EDITED / total : null,
      rejectedRate: total > 0 ? counts.REJECTED / total : null,
    };
  },

  async getEstimatedTimeSaved() {
    const ASSUMED_MANUAL_MINUTES = 8;
    const ASSUMED_REVIEW_MINUTES = 2;

    const usedSuggestions = await prisma.aIFeedback.count({
      where: { targetType: "SUGGESTION", decision: { in: ["ACCEPTED", "EDITED"] } },
    });

    const minutesSaved = usedSuggestions * (ASSUMED_MANUAL_MINUTES - ASSUMED_REVIEW_MINUTES);

    return {
      usedSuggestions,
      minutesSaved,
      assumedManualMinutes: ASSUMED_MANUAL_MINUTES,
      assumedReviewMinutes: ASSUMED_REVIEW_MINUTES,
    };
  },
};