import { requireRole } from "@/lib/auth-helpers";
import { TicketForm } from "@/components/tickets/ticket-form";

export default async function NewTicketPage() {
  await requireRole(["ADMIN", "MANAGER", "AGENT"]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Nowy ticket</h1>
      <TicketForm />
    </div>
  );
}