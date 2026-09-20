"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function ProfileForm({
  currentName,
  email,
  role,
}: {
  currentName: string;
  email: string;
  role: string;
}) {
  const [name, setName] = useState(currentName);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    startTransition(async () => {
      const { error } = await authClient.updateUser({ name });
      if (error) {
        setMessage("Nie udało się zaktualizować profilu.");
        return;
      }
      setMessage("Zapisano.");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Imię i nazwisko</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Email</p>
          <p>{email}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Rola</p>
          <Badge variant="outline">{role}</Badge>
        </div>
      </div>
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Zapisywanie..." : "Zapisz zmiany"}
      </Button>
    </form>
  );
}