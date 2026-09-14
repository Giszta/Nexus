import { prisma } from "@/lib/prisma";
import type { Role } from "@/lib/auth-helpers";

export const UserRepository = {
  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  async findByRole(role: Role) {
    return prisma.user.findMany({ where: { role } });
  },

  async listAll() {
    return prisma.user.findMany({ orderBy: { createdAt: "asc" } });
  },
  async findAssignable() {
  return prisma.user.findMany({
    where: { role: { in: ["AGENT", "MANAGER"] } },
    orderBy: { name: "asc" },
  });
},
};