import { prisma } from "@/lib/prisma";
import type { TicketActivityType } from "@prisma/client";

export const TicketActivityRepository = {
  async log(data: {
    ticketId: string;
    actorId: string;
    type: TicketActivityType;
    fromValue?: string;
    toValue?: string;
  }) {
    return prisma.ticketActivity.create({ data });
  },

  async listForTicket(ticketId: string) {
    return prisma.ticketActivity.findMany({
      where: { ticketId },
      orderBy: { createdAt: "desc" },
      include: {
        actor: { select: { name: true } },
      },
    });
  },
};