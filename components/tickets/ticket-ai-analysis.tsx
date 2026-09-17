"use client";

import { useState, useTransition } from "react";
import { analyzeTicket, reviewAnalysis } from "@/app/(app)/tickets/actions";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Sparkles, Check, X, Pencil } from "lucide-react";
import type { AIAnalysis, AIFeedback, TicketCategory, TicketPriority } from "@prisma/client";

export function TicketAIAnalysis({
  ticketId,
  analysis,
  feedback,
}: {
  ticketId: string;
  analysis: AIAnalysis | null;
  feedback: AIFeedback | null;
}) {
  const [isPending, startTransition] = useTransition();
  const [editOpen, setEditOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<TicketCategory | undefined>(
    analysis?.category ?? undefined
  );
  const [editPriority, setEditPriority] = useState<TicketPriority | undefined>(
    analysis?.priority ?? undefined
  );

  function handleAnalyze() {
    startTransition(() => {
      analyzeTicket(ticketId);
    });
  }

  function handleDecision(decision: "ACCEPTED" | "REJECTED") {
    if (!analysis) return;
    startTransition(() => {
      reviewAnalysis(ticketId, analysis.id, decision);
    });
  }

  function handleSaveEdit() {
    if (!analysis) return;
    startTransition(() => {
      reviewAnalysis(ticketId, analysis.id, "EDITED", editCategory, editPriority);
      setEditOpen(false);
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
        <CardContent className="space-y-3 text-sm">
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

          {feedback ? (
            <div className="border-t pt-3">
              <Badge variant="outline">
                {feedback.decision === "ACCEPTED" && "Zaakceptowano"}
                {feedback.decision === "EDITED" &&
                  `Edytowano → ${feedback.editedCategory ?? "—"} / ${feedback.editedPriority ?? "—"}`}
                {feedback.decision === "REJECTED" && "Odrzucono"}
              </Badge>
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
                    <DialogTitle>Popraw klasyfikację</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    <Select
                      value={editCategory}
                      onValueChange={(v) => setEditCategory(v as TicketCategory)}
                    >
                      <SelectTrigger><SelectValue placeholder="Kategoria" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HARDWARE">Hardware</SelectItem>
                        <SelectItem value="SOFTWARE">Software</SelectItem>
                        <SelectItem value="BILLING">Rozliczenia</SelectItem>
                        <SelectItem value="ACCOUNT">Konto</SelectItem>
                        <SelectItem value="OTHER">Inne</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={editPriority}
                      onValueChange={(v) => setEditPriority(v as TicketPriority)}
                    >
                      <SelectTrigger><SelectValue placeholder="Priorytet" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Niski</SelectItem>
                        <SelectItem value="MEDIUM">Średni</SelectItem>
                        <SelectItem value="HIGH">Wysoki</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
            Model: {analysis.model} · {analysis.latencyMs}ms
          </p>
        </CardContent>
      )}
    </Card>
  );
}