import { Sparkles, MessageSquareText, Check, Pencil, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function DemoTicketPreview() {
  return (
    <div className="space-y-3 text-sm">
      <div>
        <p className="text-xs text-muted-foreground">Ticket #g8pwjo</p>
        <h3 className="text-lg font-semibold">Problem z logowaniem</h3>
      </div>

      <Badge variant="outline">Otwarty</Badge>

      <Card>
        <CardContent className="pt-4">
          <p className="mb-1 text-xs font-medium text-muted-foreground">Opis</p>
          <p className="text-xs">
            Klient nie może się zalogować mimo poprawnego hasła.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4" />
              <span className="font-medium">AI Analysis</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <p className="text-xs text-muted-foreground">Kategoria</p>
              <p className="font-medium">ACCOUNT</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Priorytet</p>
              <p className="font-medium">HIGH</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pewność</p>
              <p className="font-medium">95%</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Problem dotyczący niemożności zalogowania się do konta pomimo poprawnego hasła jest bezpośrednio związany z zarządzaniem kontem i dostępem. To zagadnienie priorytetowe, gdyż uniemożliwia klientowi korzystanie z usługi.
          </p>
          <div className="flex gap-2 border-t pt-3">
            <Button size="sm" className="pointer-events-none">
              <Check className="size-4" /> Akceptuj
            </Button>
            <Button size="sm" variant="outline" className="pointer-events-none">
              <Pencil className="size-4" /> Edytuj
            </Button>
            <Button size="sm" variant="outline" className="pointer-events-none">
              <X className="size-4" /> Odrzuć
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Model: claude-haiku-4-5 · 4450ms
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-2 pt-4">
          <div className="flex items-center gap-2">
            <MessageSquareText className="size-4" />
            <span className="font-medium">AI Suggestion</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Dziękuję za zgłoszenie problemu z logowaniem.

Aby móc Ci efektywnie pomóc, potrzebuję kilku dodatkowych informacji:
<br />
1. **Czy widzisz konkretny komunikat błędu** podczas próby logowania? Jeśli tak, jaki jest jego treść?
<br />
2. **Czy kiedykolwiek udało Ci się zalogować** na to konto, czy jest to pierwszy raz?
<br />
3. **Czy masz pewność, że wpisujesz dokładnie to samo hasło**, które ustawiłeś? (Zwróć uwagę na wielkość liter, spacje lub znaki specjalne)
<br />
4. **Czy próbowałeś już resetować hasło** za pomocą opcji "Zapomnialem hasła" dostępnej na ekranie logowania?
<br />
5. **Na jakim urządzeniu/przeglądarce próbujesz się zalogować?**
<br />
Informacje te pomogą naszemu zespołowi technicznemu w diagnostyce problemu. Zebrane dane przekażemy dalej, aby jak najszybciej rozwiązać Twoją sprawę.
          </p>
        </CardContent>
      </Card>

      <p className="text-center text-[10px] text-muted-foreground">
        Rzeczywisty widok aplikacji — dane z autentycznego przebiegu
      </p>
    </div>
  );
}