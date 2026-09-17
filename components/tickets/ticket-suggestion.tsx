"use client";

import { useState, useTransition } from "react";
import { generateSuggestion, reviewSuggestion } from "@/app/(app)/tickets/actions";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { MessageSquareText, FileText, Check, X, Pencil } from "lucide-react";
import type { AISuggestion, AISuggestionSource, AIFeedback } from "@prisma/client";

type SuggestionWithSources = AISuggestion & { sources: AISuggestionSource[] };

export function TicketSuggestion({
  ticketId,
  suggestion,
  feedback,
}: {
  ticketId: string;
  suggestion: SuggestionWithSources | null;
  feedback: AIFeedback | null;
}) {
  const [isPending, startTransition] = useTransition();
  const [editOpen, setEditOpen] = useState(false);
  const [editedContent, setEditedContent] = useState(suggestion?.content ?? "");

  function handleGenerate() {
    startTransition(() => {
      generateSuggestion(ticketId);
    });
  }

  function handleDecision(decision: "ACCEPTED" | "REJECTED") {
    if (!suggestion) return;
    startTransition(() => {
      reviewSuggestion(ticketId, suggestion.id, decision);
    });
  }

  function handleSaveEdit() {
    if (!suggestion) return;
    startTransition(() => {
      reviewSuggestion(ticketId, suggestion.id, "EDITED", editedContent);
      setEditOpen(false);
    });
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm">AI Suggestion</CardTitle>
        <Button size="sm" variant="outline" onClick={handleGenerate} disabled={isPending}>
          <MessageSquareText className="size-4" />
          {isPending ? "Generowanie..." : "Generuj sugestię"}
        </Button>
      </CardHeader>
      {suggestion && (
        <CardContent className="space-y-3 text-sm">
          <p className="whitespace-pre-wrap">{suggestion.content}</p>

          {suggestion.sources.length > 0 ? (
            <div className="space-y-1 border-t pt-3">
              <p className="text-xs font-medium text-muted-foreground">Źródła:</p>
              {suggestion.sources.map((source) => (
                <div key={source.id} className="flex items-start gap-2 text-xs">
                  <FileText className="mt-0.5 size-3 shrink-0 text-muted-foreground" />
                  <div>
                    <span className="font-medium">{source.documentTitle}</span>
                    <span className="text-muted-foreground"> (dystans: {source.distance.toFixed(3)})</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="border-t pt-3 text-xs italic text-muted-foreground">
              Brak dopasowanej dokumentacji — odpowiedź bez ugruntowania w bazie wiedzy.
            </p>
          )}

          {feedback ? (
            <div className="border-t pt-3">
              <Badge variant="outline">
                {feedback.decision === "ACCEPTED" && "Zaakceptowano"}
                {feedback.decision === "EDITED" && "Edytowano przed wysłaniem"}
                {feedback.decision === "REJECTED" && "Odrzucono"}
              </Badge>
              {feedback.decision === "EDITED" && feedback.editedContent && (
                <p className="mt-2 whitespace-pre-wrap text-muted-foreground">
                  {feedback.editedContent}
                </p>
              )}
            </div>
          ) : (
            <div className="flex gap-2 border-t pt-3">
              <Button size="sm" onClick={() => handleDecision("ACCEPTED")} disabled={isPending}>
                <Check className="size-4" /> Akceptuj
              </Button>
              <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" disabled={isPending}>
                    <Pencil className="size-4" /> Edytuj
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Popraw sugerowaną odpowiedź</DialogTitle>
                  </DialogHeader>
                  <Textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    rows={6}
                  />
                  <DialogFooter>
                    <Button onClick={handleSaveEdit} disabled={isPending}>Zapisz</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button size="sm" variant="outline" onClick={() => handleDecision("REJECTED")} disabled={isPending}>
                <X className="size-4" /> Odrzuć
              </Button>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Model: {suggestion.model} · {suggestion.latencyMs}ms
          </p>
        </CardContent>
      )}
    </Card>
  );
}