import Link from "next/link";
import { requireRole } from "@/lib/auth-helpers";
import { TicketRepository } from "@/repositories/ticket-repository";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default async function AIInboxPage() {
  await requireRole(["ADMIN", "MANAGER", "AGENT"]);

  const items = await TicketRepository.findPendingReview();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">AI Inbox</h1>
        <p className="text-sm text-muted-foreground">
          Propozycje AI czekające na Twoją decyzję.
        </p>
      </div>

      {items.length === 0 ? (
        <p className="text-muted-foreground">
          Brak zgłoszeń wymagających przeglądu — dobra robota!
        </p>
      ) : (
        <div className="space-y-3">
          {items.map(({ ticket, pendingAnalysis, pendingSuggestion }) => (
            <Card key={ticket.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">{ticket.title}</CardTitle>
                <Button asChild size="sm">
                  <Link href={`/tickets/${ticket.id}`}>Przejrzyj</Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {pendingAnalysis && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">AI Analysis</Badge>
                    <span className="text-muted-foreground">
                      {pendingAnalysis.category} / {pendingAnalysis.priority} ·{" "}
                      {Math.round(pendingAnalysis.confidence * 100)}% pewności
                    </span>
                  </div>
                )}
                {pendingSuggestion && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">AI Suggestion</Badge>
                    <span className="line-clamp-1 text-muted-foreground">
                      {pendingSuggestion.content}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}