import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-10 text-center">
      <h1 className="text-4xl font-semibold">NEXUS</h1>
      <p className="max-w-md text-muted-foreground">
        AI Operations & Knowledge Platform — projekt w budowie.
      </p>
      <Button asChild>
        <a href="/dashboard">Wejdź do aplikacji</a>
      </Button>
    </main>
  );
}