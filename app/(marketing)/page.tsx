import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Search,
  BookOpen,
  Users,
  Mic,
  BarChart3,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { GithubIcon } from "@/components/icons/github-icon";
import { MiniStatusChart } from "@/components/marketing/mini-status-chart";
import { DemoTicketPreview } from "@/components/marketing/demo-ticket-preview";

const chips = [
  { icon: Sparkles, label: "Klasyfikacja AI" },
  { icon: BookOpen, label: "RAG" },
  { icon: Users, label: "Human-in-the-loop" },
  { icon: Mic, label: "Zgłoszenia głosowe" },
  { icon: BarChart3, label: "Analityka" },
  { icon: ShieldCheck, label: "RBAC" },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col ">
      <header className="flex h-16 shrink-0 items-center justify-between border-b px-6">
        <span className="text-lg font-semibold">NEXUS</span>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <a href="https://github.com/Giszta/Nexus" target="_blank" rel="noopener noreferrer">
              <GithubIcon className="size-4" />
            </a>
          </Button>
          <Button asChild size="sm">
            <Link href="/login">Zaloguj się</Link>
          </Button>
        </div>
      </header>

      <main className="grid flex-1 grid-cols-1 overflow-y-auto bg-gradient-to-b from-muted/40 to-background lg:grid-cols-2 lg:overflow-hidden">
        {/* Lewa kolumna */}
        <div className="flex flex-col justify-center gap-6 px-6 py-8 lg:px-16">
          <div className="space-y-5">
            <Badge variant="outline" className="gap-1.5">
              <Sparkles className="size-3" /> Napędzane przez Claude + RAG
            </Badge>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              AI, które wspiera zespół —
              <br />
              nie zastępuje decyzji.
            </h1>
            <p className="max-w-md text-sm lg:text-lg text-muted-foreground">
              Klasyfikacja zgłoszeń, wyszukiwanie semantyczne i sugerowane
              odpowiedzi ze wskazanymi źródłami. Zobacz, jak to wygląda obok →
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/login">
                  Zobacz demo <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="https://github.com/Giszta/Nexus" target="_blank" rel="noopener noreferrer">
                  Kod źródłowy
                </a>
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
            {chips.map((chip) => (
              <div
                key={chip.label}
                className="flex items-center gap-1.5 rounded-full border bg-background px-3 py-1.5 text-xs"
              >
                <chip.icon className="size-3.5" />
                {chip.label}
              </div>
            ))}
          </div>
          </div>

          {/* Statystyki */}
          <div className="grid grid-cols-3 gap-3 lg:pt-10">
            <Card className="shadow-sm">
              <CardContent className="py-4 text-center">
                <p className="text-xl font-semibold">77%</p>
                <p className="text-[11px] text-muted-foreground">Acceptance</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="py-4 text-center">
                <p className="text-xl font-semibold">$0.09</p>
                <p className="text-[11px] text-muted-foreground">Koszt AI</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="py-4 text-center">
                <p className="text-xl font-semibold">42</p>
                <p className="text-[11px] text-muted-foreground">Zapytań AI</p>
              </CardContent>
            </Card>
          </div>

          {/* Wykres + wyszukiwanie obok siebie */}
          <div className="grid lg:grid-cols-2 gap-3">
            <Card className="shadow-sm">
              <CardContent className="py-3">
                <p className="mb-1 text-[11px] text-muted-foreground">Tickety wg statusu</p>
                <MiniStatusChart />
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="space-y-2 py-3">
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Search className="size-3" /> Wyszukiwanie semantyczne
                </div>
                <Input
                  readOnly
                  value="jak zresetować hasło klientowi?"
                  className="h-7 text-[11px]"
                />
                <div className="flex items-center justify-between rounded-md border p-1.5 text-[11px]">
                  <span>Instrukcja logowania</span>
                  <Badge variant="outline" className="text-[9px]">
                    0.319
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          
        </div>

        {/* Prawa kolumna — sam ticket, wyśrodkowany */}
<div className="flex items-center justify-center border-t p-6 lg:overflow-y-auto lg:border-l lg:border-t-0 lg:p-8">
          <DemoTicketPreview />
        </div>
      </main>
    </div>
  );
}