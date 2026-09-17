"use client";

import { useTransition } from "react";
import { generateSuggestion } from "@/app/(app)/tickets/actions";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MessageSquareText, FileText } from "lucide-react";
import type { AISuggestion, AISuggestionSource } from "@prisma/client";

type SuggestionWithSources = AISuggestion & { sources: AISuggestionSource[] };

export function TicketSuggestion({
  ticketId,
  suggestion,
}: {
  ticketId: string;
  suggestion: SuggestionWithSources | null;
}) {
  const [isPending, startTransition] = useTransition();

  function handleGenerate() {
    startTransition(() => {
      generateSuggestion(ticketId);
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
                    <span className="text-muted-foreground">
                      {" "}
                      (dystans: {source.distance.toFixed(3)})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="border-t pt-3 text-xs italic text-muted-foreground">
              Brak dopasowanej dokumentacji — odpowiedź bez ugruntowania w bazie wiedzy.
            </p>
          )}

          <p className="text-xs text-muted-foreground">
            Model: {suggestion.model} · {suggestion.latencyMs}ms
            {suggestion.inputTokens &&
              ` · ${suggestion.inputTokens + (suggestion.outputTokens ?? 0)} tokenów`}
          </p>
        </CardContent>
      )}
    </Card>
  );
}