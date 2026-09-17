import { prisma } from "@/lib/prisma";
import { TicketStatus, TicketPriority, TicketCategory } from "@prisma/client";

type ListTicketsParams = {
  page?: number;
  pageSize?: number;
  status?: TicketStatus;
};

export const TicketRepository = {
  async list({ page = 1, pageSize = 10, status }: ListTicketsParams = {}) {
    const where = status ? { status } : {};

    const [tickets, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          createdBy: { select: { name: true } },
          assignedTo: { select: { name: true } },
        },
      }),
      prisma.ticket.count({ where }),
    ]);

    return {
      tickets,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  },

  async findById(id: string) {
    return prisma.ticket.findUnique({
      where: { id },
      include: {
        createdBy: { select: { name: true, email: true } },
        assignedTo: { select: { name: true, email: true } },
      },
    });
  },

async create(data: {
  title: string;
  description: string;
  priority?: TicketPriority;
  category?: TicketCategory;
  createdById: string;
}) {
  return prisma.$transaction(async (tx) => {
    const ticket = await tx.ticket.create({ data });

    await tx.ticketActivity.create({
      data: {
        ticketId: ticket.id,
        actorId: data.createdById,
        type: "CREATED",
      },
    });

    return ticket;
  });
},
async findPendingReview() {
  const tickets = await prisma.ticket.findMany({
    where: {
      OR: [{ analyses: { some: {} } }, { suggestions: { some: {} } }],
    },
    include: {
      analyses: { orderBy: { createdAt: "desc" }, take: 1 },
      suggestions: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });

  const allFeedback = await prisma.aIFeedback.findMany({
    select: { targetId: true },
  });
  const reviewedIds = new Set(allFeedback.map((f) => f.targetId));

  return tickets
    .map((ticket) => {
      const latestAnalysis = ticket.analyses[0] ?? null;
      const latestSuggestion = ticket.suggestions[0] ?? null;

      const pendingAnalysis =
        latestAnalysis && !reviewedIds.has(latestAnalysis.id) ? latestAnalysis : null;
      const pendingSuggestion =
        latestSuggestion && !reviewedIds.has(latestSuggestion.id) ? latestSuggestion : null;

      if (!pendingAnalysis && !pendingSuggestion) return null;

      return { ticket, pendingAnalysis, pendingSuggestion };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);
}
};

