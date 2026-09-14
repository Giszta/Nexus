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
    return prisma.ticket.create({ data });
  },
};