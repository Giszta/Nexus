"use client";

import { useTransition } from "react";
import { analyzeTicket } from "@/app/(app)/tickets/actions";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import type { AIAnalysis } from "@prisma/client";

export function TicketAIAnalysis({
  ticketId,
  analysis,
}: {
  ticketId: string;
  analysis: AIAnalysis | null;
}) {
  const [isPending, startTransition] = useTransition();

  function handleAnalyze() {
    startTransition(() => {
      analyzeTicket(ticketId);
    });
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm">AI Analysis</CardTitle>
        <Button size="sm" variant="outline" onClick={handleAnalyze} disabled={isPending}>
          <Sparkles className="size-4" />
          {isPending ? "Analizowanie..." : "Analizuj"}
        </Button>
      </CardHeader>
      {analysis && (
        <CardContent className="space-y-2 text-sm">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <p className="text-muted-foreground">Kategoria</p>
              <p className="font-medium">{analysis.category}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Priorytet</p>
              <p className="font-medium">{analysis.priority}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Pewność</p>
              <p className="font-medium">{Math.round(analysis.confidence * 100)}%</p>
            </div>
          </div>
          {analysis.reasoning && (
            <p className="text-muted-foreground">{analysis.reasoning}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Model: {analysis.model} · {analysis.latencyMs}ms
            {analysis.inputTokens &&
              ` · ${analysis.inputTokens + (analysis.outputTokens ?? 0)} tokenów`}
          </p>
        </CardContent>
      )}
    </Card>
  );
}