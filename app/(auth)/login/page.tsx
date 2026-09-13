"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const demoAccounts = [
  { role: "Admin", email: "admin@nexus.dev" },
  { role: "Manager", email: "manager@nexus.dev" },
  { role: "Agent", email: "agent@nexus.dev" },
  { role: "Viewer", email: "viewer@nexus.dev" },
];

const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const { error: signInError } = await authClient.signIn.email({
      email,
      password,
    });

    setIsLoading(false);

    if (signInError) {
      setError("Nieprawidłowy email lub hasło.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Zaloguj się do NEXUS</CardTitle>
        <CardDescription>
          Zaloguj się swoimi danymi lub użyj konta demo poniżej.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Hasło"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logowanie..." : "Zaloguj się"}
          </Button>
        </form>
        {isDemoMode && (
  <div className="mb-4 space-y-2 rounded-md border border-dashed p-3">
    <p className="text-xs font-medium text-muted-foreground">
      Tryb demo — szybkie logowanie:
    </p>
    <div className="flex flex-wrap gap-2">
      {demoAccounts.map((account) => (
        <Button
          key={account.email}
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            setEmail(account.email);
            setPassword("Password123!");
          }}
        >
          {account.role}
        </Button>
      ))}
    </div>
  </div>
)}
      </CardContent>
    </Card>
  );
}