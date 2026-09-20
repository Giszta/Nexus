import { prisma } from "@/lib/prisma";

async function main() {
  const analysisFeedbacks = await prisma.aIFeedback.findMany({
    where: { targetType: "ANALYSIS" },
  });

  let created = 0;
  for (const fb of analysisFeedbacks) {
    const latestSuggestion = await prisma.aISuggestion.findFirst({
      where: { ticketId: fb.ticketId },
      orderBy: { createdAt: "desc" },
    });
    if (!latestSuggestion) continue;

    const existing = await prisma.aIFeedback.findFirst({
      where: { targetType: "SUGGESTION", targetId: latestSuggestion.id },
    });
    if (existing) continue;

    await prisma.aIFeedback.create({
      data: {
        ticketId: fb.ticketId,
        targetType: "SUGGESTION",
        targetId: latestSuggestion.id,
        decision: fb.decision,
        reviewedById: fb.reviewedById,
      },
    });
    created++;
  }

  console.log(`Dodano ${created} brakujących rekordów feedbacku dla sugestii.`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });