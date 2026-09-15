import { notFound } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { TicketRepository } from "@/repositories/ticket-repository";
import { TicketActivityRepository } from "@/repositories/ticket-activity-repository";
import { UserRepository } from "@/repositories/user-repository";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { TicketStatusSelect } from "@/components/tickets/ticket-status-select";
import { TicketAssignSelect } from "@/components/tickets/ticket-assign-select";
import { prisma } from "@/lib/prisma";
import { TicketAIAnalysis } from "@/components/tickets/ticket-ai-analysis";
import { TicketSuggestion } from "@/components/tickets/ticket-suggestion";
const activityLabels: Record<string, string> = {
  CREATED: "utworzył(a) zgłoszenie",
  STATUS_CHANGED: "zmienił(a) status",
  ASSIGNED: "przypisał(a) zgłoszenie",
  PRIORITY_CHANGED: "zmienił(a) priorytet",
};

export default async function TicketDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession();
  const role = (session?.user as { role?: string })?.role;

const [ticket, activities, assignableUsers, latestAnalysis, latestSuggestion] =
  await Promise.all([
    TicketRepository.findById(id),
    TicketActivityRepository.listForTicket(id),
    UserRepository.findAssignable(),
    prisma.aIAnalysis.findFirst({
      where: { ticketId: id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.aISuggestion.findFirst({
      where: { ticketId: id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

if (!ticket) {
  notFound();
}

const canManage = role === "ADMIN" || role === "MANAGER" || role === "AGENT";
const canAssign = role === "ADMIN" || role === "MANAGER";

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">
          Ticket #{ticket.id.slice(-6)}
        </p>
        <h1 className="text-2xl font-semibold">{ticket.title}</h1>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {canManage ? (
          <TicketStatusSelect ticketId={ticket.id} currentStatus={ticket.status} />
        ) : (
          <Badge variant="outline">{ticket.status}</Badge>
        )}
        {ticket.priority && <Badge variant="secondary">{ticket.priority}</Badge>}
        {ticket.category && <Badge variant="secondary">{ticket.category}</Badge>}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Opis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-sm">{ticket.description}</p>
        </CardContent>
        
      </Card>
        <TicketAIAnalysis ticketId={ticket.id} analysis={latestAnalysis} />
        <TicketSuggestion ticketId={ticket.id} suggestion={latestSuggestion} />
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Zgłosił</p>
          <p>{ticket.createdBy.name}</p>
        </div>
        <div>
          <p className="mb-1 text-muted-foreground">Przypisany do</p>
          {canAssign ? (
            <TicketAssignSelect
              ticketId={ticket.id}
              currentAssigneeId={ticket.assignedToId}
              assignableUsers={assignableUsers}
            />
          ) : (
            <p>{ticket.assignedTo?.name ?? "Nieprzypisany"}</p>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {activities.map((activity) => (
            <div key={activity.id} className="text-sm">
              <span className="font-medium">{activity.actor.name}</span>{" "}
              <span className="text-muted-foreground">
                {activityLabels[activity.type]}
              </span>
              {activity.fromValue && activity.toValue && (
                <span className="text-muted-foreground">
                  {" "}
                  ({activity.fromValue} → {activity.toValue})
                </span>
              )}
              <p className="text-xs text-muted-foreground">
                {activity.createdAt.toLocaleString("pl-PL")}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}