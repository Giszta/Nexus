"use client";

import { useTransition } from "react";
import { deleteDocument } from "@/app/(app)/knowledge-base/actions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export function DeleteDocumentButton({ documentId }: { documentId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleConfirmDelete() {
    startTransition(() => {
      deleteDocument(documentId);
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Trash2 className="size-4" />
          Usuń
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Usunąć ten dokument?</AlertDialogTitle>
          <AlertDialogDescription>
            Tej operacji nie można cofnąć. Dokument zostanie trwale usunięty
            z bazy wiedzy.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anuluj</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmDelete} disabled={isPending}>
            {isPending ? "Usuwanie..." : "Usuń"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}