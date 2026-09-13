import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";

export type Role = "ADMIN" | "MANAGER" | "AGENT" | "VIEWER";

export async function requireRole(allowedRoles: Role[]) {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  const userRole = (session.user as { role?: string }).role as Role;

  if (!allowedRoles.includes(userRole)) {
    redirect("/dashboard");
  }

  return session;
}