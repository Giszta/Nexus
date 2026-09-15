"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { TicketRepository } from "@/repositories/ticket-repository";
import { createTicketSchema } from "@/schemas/ticket";

import { prisma } from "@/lib/prisma";
import type { TicketStatus } from "@prisma/client";
import { UserRepository } from "@/repositories/user-repository";

import { AIService } from "@/lib/ai/ai-service";


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

export async function updateTicketStatus(
  ticketId: string,
  newStatus: TicketStatus
) {
  const session = await getServerSession();
  if (!session) redirect("/login");

  const role = (session.user as { role?: string }).role;
  if (role === "VIEWER") {
    throw new Error("Brak uprawnień do zmiany statusu.");
  }

  const ticket = await TicketRepository.findById(ticketId);
  if (!ticket) throw new Error("Nie znaleziono ticketu.");

  await prisma.$transaction(async (tx) => {
    await tx.ticket.update({
      where: { id: ticketId },
      data: { status: newStatus },
    });

    await tx.ticketActivity.create({
      data: {
        ticketId,
        actorId: session.user.id,
        type: "STATUS_CHANGED",
        fromValue: ticket.status,
        toValue: newStatus,
      },
    });
  });

  revalidatePath(`/tickets/${ticketId}`);
}

export async function assignTicket(ticketId: string, assigneeId: string) {
  const session = await getServerSession();
  if (!session) redirect("/login");

  const role = (session.user as { role?: string }).role;
  if (role !== "ADMIN" && role !== "MANAGER") {
    throw new Error("Brak uprawnień do przypisywania zgłoszeń.");
  }

  const ticket = await TicketRepository.findById(ticketId);
  if (!ticket) throw new Error("Nie znaleziono ticketu.");

  const newAssignee = await UserRepository.findById(assigneeId);
  if (!newAssignee) throw new Error("Nie znaleziono użytkownika.");

  await prisma.$transaction(async (tx) => {
    await tx.ticket.update({
      where: { id: ticketId },
      data: { assignedToId: assigneeId },
    });

    await tx.ticketActivity.create({
      data: {
        ticketId,
        actorId: session.user.id,
        type: "ASSIGNED",
        fromValue: ticket.assignedTo?.name ?? "Nieprzypisany",
        toValue: newAssignee.name,
      },
    });
  });

  revalidatePath(`/tickets/${ticketId}`);
}

export async function analyzeTicket(ticketId: string) {
  const session = await getServerSession();
  if (!session) redirect("/login");

  const role = (session.user as { role?: string }).role;
  if (role === "VIEWER") {
    throw new Error("Brak uprawnień do analizy AI.");
  }

  const ticket = await TicketRepository.findById(ticketId);
  if (!ticket) throw new Error("Nie znaleziono ticketu.");

  const result = await AIService.classifyTicket(ticket.title, ticket.description);

  await prisma.aIAnalysis.create({
    data: {
      ticketId,
      model: result.model,
      promptVersion: result.promptVersion,
      category: result.category,
      priority: result.priority,
      confidence: result.confidence,
      reasoning: result.reasoning,
      latencyMs: result.latencyMs,
      inputTokens: result.inputTokens,
      outputTokens: result.outputTokens,
    },
  });

  revalidatePath(`/tickets/${ticketId}`);
}