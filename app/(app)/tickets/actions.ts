"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { TicketRepository } from "@/repositories/ticket-repository";
import { createTicketSchema } from "@/schemas/ticket";

export async function createTicket(formData: FormData) {
  const session = await getServerSession();
  if (!session) redirect("/login");

  const role = (session.user as { role?: string }).role;
  if (role === "VIEWER") {
    throw new Error("Brak uprawnień do tworzenia zgłoszeń.");
  }

  const parsed = createTicketSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    priority: formData.get("priority") || undefined,
    category: formData.get("category") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const ticket = await TicketRepository.create({
    ...parsed.data,
    createdById: session.user.id,
  });

  revalidatePath("/tickets");
  redirect(`/tickets/${ticket.id}`);
}