import Link from "next/link";
import { TicketRepository } from "@/repositories/ticket-repository";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import type { TicketStatus } from "@prisma/client";

const statusLabels: Record<TicketStatus, string> = {
  OPEN: "Otwarty",
  IN_PROGRESS: "W trakcie",
  RESOLVED: "Rozwiązany",
  CLOSED: "Zamknięty",
};
const statusFilters: { label: string; value: TicketStatus | undefined }[] = [
  { label: "Wszystkie", value: undefined },
  { label: "Otwarte", value: "OPEN" },
  { label: "W trakcie", value: "IN_PROGRESS" },
  { label: "Rozwiązane", value: "RESOLVED" },
  { label: "Zamknięte", value: "CLOSED" },
];
export default async function TicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? "1");
  const status = params.status as TicketStatus | undefined;

  const { tickets, totalPages } = await TicketRepository.list({
    page,
    status,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
  {statusFilters.map((filter) => (
    <Button
      key={filter.label}
      asChild
      variant={status === filter.value ? "default" : "outline"}
      size="sm"
    >
      <Link href={filter.value ? `/tickets?status=${filter.value}` : "/tickets"}>
        {filter.label}
      </Link>
    </Button>
  ))}
</div>
        <h1 className="text-2xl font-semibold">Tickets</h1>
        <Button asChild>
          <Link href="/tickets/new">Nowy ticket</Link>
        </Button>
      </div>

      {tickets.length === 0 ? (
        <p className="text-muted-foreground">Brak zgłoszeń do wyświetlenia.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tytuł</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priorytet</TableHead>
              <TableHead>Przypisany do</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>
                  <Link
                    href={`/tickets/${ticket.id}`}
                    className="hover:underline"
                  >
                    {ticket.title}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {statusLabels[ticket.status]}
                  </Badge>
                </TableCell>
                <TableCell>{ticket.priority ?? "—"}</TableCell>
                <TableCell>{ticket.assignedTo?.name ?? "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

<div className="flex items-center justify-between">
  {page > 1 ? (
    <Button asChild variant="outline" size="sm">
      <Link href={`/tickets?page=${page - 1}`}>Poprzednia</Link>
    </Button>
  ) : (
    <Button variant="outline" size="sm" disabled>
      Poprzednia
    </Button>
  )}
  <span className="text-sm text-muted-foreground">
    Strona {page} z {totalPages || 1}
  </span>
  {page < totalPages ? (
    <Button asChild variant="outline" size="sm">
      <Link href={`/tickets?page=${page + 1}`}>Następna</Link>
    </Button>
  ) : (
    <Button variant="outline" size="sm" disabled>
      Następna
    </Button>
  )}
</div>
    </div>
  );
}