import { prisma } from "@/lib/prisma";

export const DashboardRepository = {
  async getSummary(userId: string, role: string) {
    const [openTickets, myAssignedTickets, recentTickets, pendingReviewCount] =
      await Promise.all([
        prisma.ticket.count({ where: { status: "OPEN" } }),
        role !== "VIEWER"
          ? prisma.ticket.count({ where: { assignedToId: userId } })
          : Promise.resolve(0),
        prisma.ticket.findMany({
          orderBy: { createdAt: "desc" },
          take: 5,
          include: { assignedTo: { select: { name: true } } },
        }),
        role !== "VIEWER"
          ? prisma.ticket
              .findMany({
                where: {
                  OR: [{ analyses: { some: {} } }, { suggestions: { some: {} } }],
                },
                select: { id: true, analyses: { select: { id: true }, take: 1 }, suggestions: { select: { id: true }, take: 1 } },
              })
              .then(async (tickets) => {
                const feedback = await prisma.aIFeedback.findMany({ select: { targetId: true } });
                const reviewed = new Set(feedback.map((f) => f.targetId));
                return tickets.filter((t) => {
                  const analysisId = t.analyses[0]?.id;
                  const suggestionId = t.suggestions[0]?.id;
                  return (analysisId && !reviewed.has(analysisId)) || (suggestionId && !reviewed.has(suggestionId));
                }).length;
              })
          : Promise.resolve(0),
      ]);

    return { openTickets, myAssignedTickets, recentTickets, pendingReviewCount };
  },
    async getAIHighlights() {
    const overallFeedback = await prisma.aIFeedback.groupBy({
      by: ["decision"],
      _count: true,
    });
    const total = overallFeedback.reduce((sum, f) => sum + f._count, 0);
    const accepted = overallFeedback.find((f) => f.decision === "ACCEPTED")?._count ?? 0;

    const [analyses, suggestions] = await Promise.all([
      prisma.aIAnalysis.findMany({ select: { model: true, inputTokens: true, outputTokens: true } }),
      prisma.aISuggestion.findMany({ select: { model: true, inputTokens: true, outputTokens: true } }),
    ]);
    const totalRequests = analyses.length + suggestions.length;

    return {
      acceptanceRate: total > 0 ? Math.round((accepted / total) * 100) : null,
      totalRequests,
    };
  },
};