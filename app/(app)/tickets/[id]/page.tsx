import { notFound } from "next/navigation";
import { TicketRepository } from "@/repositories/ticket-repository";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

export default async function TicketDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ticket = await TicketRepository.findById(id);

  if (!ticket) {
    notFound();
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">
          Ticket #{ticket.id.slice(-6)}
        </p>
        <h1 className="text-2xl font-semibold">{ticket.title}</h1>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="outline">{ticket.status}</Badge>
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

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Zgłosił</p>
          <p>{ticket.createdBy.name}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Przypisany do</p>
          <p>{ticket.assignedTo?.name ?? "Nieprzypisany"}</p>
        </div>
      </div>
    </div>
  );
}