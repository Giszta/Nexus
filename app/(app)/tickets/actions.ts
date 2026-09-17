"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { TicketRepository } from "@/repositories/ticket-repository";
import { createTicketSchema } from "@/schemas/ticket";

import { prisma } from "@/lib/prisma";
import type { TicketPriority, TicketStatus } from "@prisma/client";
import { UserRepository } from "@/repositories/user-repository";

import { AIService } from "@/lib/ai/ai-service";

import { EmbeddingService } from "@/lib/ai/embedding-service";
import { KnowledgeChunkRepository } from "@/repositories/knowledge-chunk-repository";

import type { TicketCategory } from "@prisma/client";

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

const RELEVANCE_THRESHOLD = 0.5;

export async function generateSuggestion(ticketId: string) {
  const session = await getServerSession();
  if (!session) redirect("/login");

  const role = (session.user as { role?: string }).role;
  if (role === "VIEWER") {
    throw new Error("Brak uprawnień do generowania sugestii AI.");
  }

  const ticket = await TicketRepository.findById(ticketId);
  if (!ticket) throw new Error("Nie znaleziono ticketu.");

  const query = `${ticket.title}\n${ticket.description}`;
  const queryEmbedding = await EmbeddingService.embedQuery(query);
  const matches = await KnowledgeChunkRepository.searchSimilar(queryEmbedding, 3);

  const relevantMatches = matches.filter((m) => m.distance < RELEVANCE_THRESHOLD);

  const context = relevantMatches.map((m) => ({
    documentTitle: m.documentTitle,
    content: m.content,
  }));

  const result = await AIService.suggestResponse(
    ticket.title,
    ticket.description,
    context
  );

  await prisma.$transaction(async (tx) => {
    const suggestion = await tx.aISuggestion.create({
      data: {
        ticketId,
        content: result.content,
        model: result.model,
        promptVersion: result.promptVersion,
        latencyMs: result.latencyMs,
        inputTokens: result.inputTokens,
        outputTokens: result.outputTokens,
      },
    });

    if (relevantMatches.length > 0) {
      await tx.aISuggestionSource.createMany({
        data: relevantMatches.map((m) => ({
          suggestionId: suggestion.id,
          documentId: m.documentId,
          documentTitle: m.documentTitle,
          snippet: m.content.slice(0, 200),
          distance: m.distance,
        })),
      });
    }
  });

  revalidatePath(`/tickets/${ticketId}`);
}

export async function reviewAnalysis(
  ticketId: string,
  analysisId: string,
  decision: "ACCEPTED" | "EDITED" | "REJECTED",
  editedCategory?: TicketCategory,
  editedPriority?: TicketPriority
) {
  const session = await getServerSession();
  if (!session) redirect("/login");

  const role = (session.user as { role?: string }).role;
  if (role === "VIEWER") {
    throw new Error("Brak uprawnień do przeglądu sugestii AI.");
  }

  const analysis = await prisma.aIAnalysis.findUnique({ where: { id: analysisId } });
  if (!analysis) throw new Error("Nie znaleziono analizy.");

  const ticket = await TicketRepository.findById(ticketId);
  if (!ticket) throw new Error("Nie znaleziono ticketu.");

  const finalCategory = decision === "EDITED" ? editedCategory : analysis.category;
  const finalPriority = decision === "EDITED" ? editedPriority : analysis.priority;

  await prisma.$transaction(async (tx) => {
    await tx.aIFeedback.create({
      data: {
        ticketId,
        targetType: "ANALYSIS",
        targetId: analysisId,
        decision,
        editedCategory: decision === "EDITED" ? editedCategory : undefined,
        editedPriority: decision === "EDITED" ? editedPriority : undefined,
        reviewedById: session.user.id,
      },
    });

    if (decision === "REJECTED") return;

    const updates: { category?: TicketCategory; priority?: TicketPriority } = {};
    if (finalCategory && finalCategory !== ticket.category) updates.category = finalCategory;
    if (finalPriority && finalPriority !== ticket.priority) updates.priority = finalPriority;

    if (Object.keys(updates).length === 0) return;

    await tx.ticket.update({ where: { id: ticketId }, data: updates });

    if (updates.category) {
      await tx.ticketActivity.create({
        data: {
          ticketId,
          actorId: session.user.id,
          type: "CATEGORY_CHANGED",
          fromValue: ticket.category ?? "brak",
          toValue: updates.category,
        },
      });
    }
    if (updates.priority) {
      await tx.ticketActivity.create({
        data: {
          ticketId,
          actorId: session.user.id,
          type: "PRIORITY_CHANGED",
          fromValue: ticket.priority ?? "brak",
          toValue: updates.priority,
        },
      });
    }
  });

  revalidatePath(`/tickets/${ticketId}`);
}

export async function reviewSuggestion(
  ticketId: string,
  suggestionId: string,
  decision: "ACCEPTED" | "EDITED" | "REJECTED",
  editedContent?: string
) {
  const session = await getServerSession();
  if (!session) redirect("/login");

  const role = (session.user as { role?: string }).role;
  if (role === "VIEWER") {
    throw new Error("Brak uprawnień do przeglądu sugestii AI.");
  }

  await prisma.aIFeedback.create({
    data: {
      ticketId,
      targetType: "SUGGESTION",
      targetId: suggestionId,
      decision,
      editedContent: decision === "EDITED" ? editedContent : undefined,
      reviewedById: session.user.id,
    },
  });

  revalidatePath(`/tickets/${ticketId}`);
}