"use client";

import { useActionState } from "react";
import { createTicket } from "@/app/(app)/tickets/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FormState = {
  error?: {
    title?: string[];
    description?: string[];
    priority?: string[];
    category?: string[];
  };
} | null;

export function TicketForm() {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    async (_prevState, formData) => {
      const result = await createTicket(formData);
      return result ?? null;
    },
    null
  );

  return (
    <form action={formAction} className="max-w-lg space-y-4">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Tytuł
        </label>
        <Input id="title" name="title" placeholder="Krótki opis problemu" />
        {state?.error?.title && (
          <p className="text-sm text-destructive">{state.error.title[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Opis
        </label>
        <Textarea
          id="description"
          name="description"
          placeholder="Szczegółowy opis zgłoszenia..."
          rows={5}
        />
        {state?.error?.description && (
          <p className="text-sm text-destructive">
            {state.error.description[0]}
          </p>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Priorytet</label>
          <Select name="priority">
            <SelectTrigger>
              <SelectValue placeholder="Wybierz (opcjonalnie)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LOW">Niski</SelectItem>
              <SelectItem value="MEDIUM">Średni</SelectItem>
              <SelectItem value="HIGH">Wysoki</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Kategoria</label>
          <Select name="category">
            <SelectTrigger>
              <SelectValue placeholder="Wybierz (opcjonalnie)" />
            </SelectTrigger>
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

      <Button type="submit" disabled={isPending}>
        {isPending ? "Tworzenie..." : "Utwórz ticket"}
      </Button>
    </form>
  );
}