"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import type { Role } from "@/lib/auth-helpers";

export async function updateUserRole(userId: string, newRole: Role) {
  const session = await getServerSession();
  if (!session) redirect("/login");

  const role = (session.user as { role?: string }).role;
  if (role !== "ADMIN") {
    throw new Error("Tylko administrator może zmieniać role użytkowników.");
  }

  if (userId === session.user.id) {
    throw new Error("Nie możesz zmienić własnej roli.");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
  });

  revalidatePath("/settings");
}