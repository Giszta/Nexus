"use client";

import { useTransition } from "react";
import { generateSuggestion } from "@/app/(app)/tickets/actions";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MessageSquareText } from "lucide-react";
import type { AISuggestion } from "@prisma/client";

export function TicketSuggestion({
  ticketId,
  suggestion,
}: {
  ticketId: string;
  suggestion: AISuggestion | null;
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
        <CardContent className="space-y-2 text-sm">
          <p className="text-muted-foreground">{suggestion.content}</p>
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