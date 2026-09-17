import { prisma } from "@/lib/prisma";

export const AnalyticsRepository = {
  async getCountsByStatus() {
    const result = await prisma.ticket.groupBy({
      by: ["status"],
      _count: true,
    });
    return result.map((r) => ({ label: r.status, count: r._count }));
  },

  async getCountsByPriority() {
    const result = await prisma.ticket.groupBy({
      by: ["priority"],
      _count: true,
    });
    return result.map((r) => ({ label: r.priority ?? "Brak", count: r._count }));
  },

  async getCountsByCategory() {
    const result = await prisma.ticket.groupBy({
      by: ["category"],
      _count: true,
    });
    return result.map((r) => ({ label: r.category ?? "Brak", count: r._count }));
  },

  async getWorkloadByAssignee() {
    const result = await prisma.ticket.groupBy({
      by: ["assignedToId"],
      _count: true,
      where: { assignedToId: { not: null } },
    });

    const userIds = result.map((r) => r.assignedToId).filter((id): id is string => id !== null);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true },
    });
    const userMap = new Map(users.map((u) => [u.id, u.name]));

    return result.map((r) => ({
      label: userMap.get(r.assignedToId!) ?? "Nieznany",
      count: r._count,
    }));
  },
};