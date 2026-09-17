import { requireRole } from "@/lib/auth-helpers";
import { VoiceTicketRecorder } from "@/components/tickets/voice-ticket-recorder";

export default async function VoiceTicketPage() {
  await requireRole(["ADMIN", "MANAGER", "AGENT"]);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Nowy ticket głosowy</h1>
        <p className="text-sm text-muted-foreground">
          Opowiedz o zgłoszeniu, a AI przygotuje szkic do przejrzenia.
        </p>
      </div>
      <VoiceTicketRecorder />
    </div>
  );
}