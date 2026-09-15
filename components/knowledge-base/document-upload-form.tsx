"use client";

import { useActionState } from "react";
import { uploadDocument } from "@/app/(app)/knowledge-base/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type FormState = {
  error?: { title?: string[]; file?: string[] };
} | null;

export function DocumentUploadForm() {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    async (_prevState, formData) => {
      const result = await uploadDocument(formData);
      return result ?? null;
    },
    null
  );

  return (
    <form action={formAction} className="max-w-lg space-y-4">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Tytuł dokumentu
        </label>
        <Input id="title" name="title" placeholder="np. Instrukcja instalacji v2.4" />
        {state?.error?.title && (
          <p className="text-sm text-destructive">{state.error.title[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="file" className="text-sm font-medium">
          Plik (.txt lub .md, maks. 500 KB)
        </label>
        <Input id="file" name="file" type="file" accept=".txt,.md" />
        {state?.error?.file && (
          <p className="text-sm text-destructive">{state.error.file[0]}</p>
        )}
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Przesyłanie..." : "Prześlij dokument"}
      </Button>
    </form>
  );
}