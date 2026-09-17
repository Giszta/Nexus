"use client";

import { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Mic, Square, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { extractTicketDraft, createTicket } from "@/app/(app)/tickets/actions";
import type { TicketCategory, TicketPriority } from "@prisma/client";

type Draft = {
  title: string;
  category: TicketCategory;
  priority: TicketPriority;
  description: string;
  suggestedAction: string;
};

export function VoiceTicketRecorder() {
  const [isSupported] = useState(
    () =>
      typeof window !== "undefined" &&
      ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
  );
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [isPending, startTransition] = useTransition();
  const recognitionRef = useRef<any>(null);
  const router = useRouter();

  function startRecording() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "pl-PL";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      let text = "";
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript + " ";
      }
      setTranscript(text.trim());
    };

    recognition.onerror = () => setIsRecording(false);
    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
  }

  function stopRecording() {
    recognitionRef.current?.stop();
    setIsRecording(false);
  }

  function handleExtract() {
    startTransition(async () => {
      const result = await extractTicketDraft(transcript);
      setDraft(result);
    });
  }

  function handleCreateTicket(formData: FormData) {
    startTransition(async () => {
      await createTicket(formData);
    });
  }

  if (!isSupported) {
    return (
      <Card>
        <CardContent className="pt-6 text-sm text-muted-foreground">
          Twoja przeglądarka nie wspiera rozpoznawania mowy (Web Speech API).
          Ta funkcja działa w Chrome i Edge. Użyj zwykłego formularza tworzenia
          ticketu zamiast tego.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Nagranie głosowe</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            type="button"
            variant={isRecording ? "destructive" : "default"}
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? (
              <>
                <Square className="size-4" /> Zatrzymaj nagrywanie
              </>
            ) : (
              <>
                <Mic className="size-4" /> Rozpocznij nagrywanie
              </>
            )}
          </Button>

          {transcript && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Transkrypcja:</p>
              <p className="rounded-md border p-3 text-sm">{transcript}</p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleExtract}
                disabled={isPending || isRecording}
              >
                <Sparkles className="size-4" />
                {isPending ? "Analizowanie..." : "Wyodrębnij dane zgłoszenia"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {draft && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Szkic zgłoszenia (do sprawdzenia)</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={handleCreateTicket} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tytuł</label>
                <Input name="title" defaultValue={draft.title} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Opis</label>
                <Textarea name="description" defaultValue={draft.description} rows={4} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Priorytet</label>
                  <Select name="priority" defaultValue={draft.priority}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Niski</SelectItem>
                      <SelectItem value="MEDIUM">Średni</SelectItem>
                      <SelectItem value="HIGH">Wysoki</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Kategoria</label>
                  <Select name="category" defaultValue={draft.category}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HARDWARE">Hardware</SelectItem>
                      <SelectItem value="SOFTWARE">Software</SelectItem>
                      <SelectItem value="BILLING">Rozliczenia</SelectItem>
                      <SelectItem value="ACCOUNT">Konto</SelectItem>
                      <SelectItem value="OTHER">Inne</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Sugerowana akcja AI: {draft.suggestedAction}
              </p>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Tworzenie..." : "Utwórz ticket"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}