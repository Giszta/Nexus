import { prisma } from "@/lib/prisma";
import { AIService } from "@/lib/ai/ai-service";
import { EmbeddingService } from "@/lib/ai/embedding-service";
import { KnowledgeChunkRepository } from "@/repositories/knowledge-chunk-repository";
import { indexDocument } from "@/lib/rag/index-document";
import type { TicketPriority, TicketCategory } from "@prisma/client";

const RELEVANCE_THRESHOLD = 0.5;

const demoTickets: {
  title: string;
  description: string;
  status?: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  simulateFeedback?: "ACCEPTED" | "EDITED" | null;
}[] = [
 {
  title: "Nie mogę zresetować hasła do konta",
  description: "Klient klika link resetujący hasło z maila, ale strona pokazuje błąd 'Link wygasł', mimo że kliknął w niego kilka minut po otrzymaniu wiadomości.",
  status: "OPEN",
  simulateFeedback: "ACCEPTED",
},
{
  title: "Faktura zawiera nieprawidłową kwotę VAT",
  description: "Klient zauważył, że na fakturze za ostatni miesiąc naliczono 23% VAT zamiast obowiązującego dla jego branży 8%. Prosi o korektę faktury.",
  status: "OPEN",
  simulateFeedback: "EDITED",
},
{
  title: "Aplikacja mobilna zawiesza się przy otwieraniu raportów",
  description: "Od aktualizacji do wersji 4.2 aplikacja na Androidzie zawiesza się na czarnym ekranie przy próbie otwarcia zakładki 'Raporty'. Restart telefonu nie pomaga.",
  status: "IN_PROGRESS",
  simulateFeedback: "ACCEPTED",
},
{
  title: "Prośba o zmianę adresu e-mail przypisanego do konta",
  description: "Klient zmienił pracodawcę i prosi o aktualizację adresu e-mail powiązanego z kontem firmowym na nowy, bez utraty historii zgłoszeń.",
  status: "RESOLVED",
  simulateFeedback: "ACCEPTED",
},
{
  title: "Drukarka sieciowa nie odpowiada po aktualizacji sterowników",
  description: "Po wymuszonej aktualizacji sterowników przez dział IT, drukarka w biurze przestała być widoczna w sieci. Cały zespół księgowości nie może drukować dokumentów.",
  status: "OPEN",
  simulateFeedback: null,
},
{
  title: "Podwójne obciążenie karty za subskrypcję premium",
  description: "Klient zgłasza dwa identyczne obciążenia w tym samym dniu za subskrypcję Premium. Prosi o zwrot nadpłaty i wyjaśnienie przyczyny.",
  status: "OPEN",
  simulateFeedback: null,
},
{
  title: "Brak możliwości eksportu danych do CSV",
  description: "Przycisk 'Eksportuj do CSV' na stronie Analytics nie reaguje na kliknięcie od wczorajszej aktualizacji przeglądarki Chrome.",
  status: "OPEN",
  simulateFeedback: "ACCEPTED",
},
{
  title: "Pytanie o możliwość integracji z systemem księgowym",
  description: "Klient pyta, czy istnieje gotowa integracja z popularnym polskim systemem księgowym, czy trzeba by budować własne rozwiązanie przez API.",
  status: "OPEN",
  simulateFeedback: null,
},
{
  title: "Monitor zewnętrzny nie jest wykrywany przez laptopa",
  description: "Pracownik zgłasza, że po aktualizacji systemu Windows monitor zewnętrzny podłączony przez HDMI przestał być rozpoznawany, mimo że działał poprawnie tydzień temu.",
  status: "OPEN",
  simulateFeedback: "ACCEPTED",
},
{
  title: "Błędne naliczenie rabatu lojalnościowego",
  description: "Stały klient z 3-letnim stażem zauważył, że jego 15% rabat lojalnościowy nie został zastosowany przy ostatnim odnowieniu subskrypcji rocznej.",
  status: "OPEN",
  simulateFeedback: "EDITED",
},
{
  title: "Powiadomienia push przestały działać na iOS",
  description: "Kilku użytkowników iPhone zgłasza, że od dwóch dni nie otrzymują powiadomień push o nowych wiadomościach, mimo że są włączone w ustawieniach aplikacji.",
  status: "IN_PROGRESS",
  simulateFeedback: null,
},
{
  title: "Prośba o usunięcie konta i danych osobowych (RODO)",
  description: "Klient formalnie żąda usunięcia swojego konta oraz wszystkich powiązanych danych osobowych zgodnie z prawem do bycia zapomnianym.",
  status: "OPEN",
  simulateFeedback: "ACCEPTED",
},
{
  title: "Klawiatura służbowego laptopa nie reaguje na niektóre klawisze",
  description: "Litery 'a', 's' i 'd' na klawiaturze laptopa firmowego przestały działać po przypadkowym zalaniu wodą. Pracownik pyta o możliwość wymiany sprzętu.",
  status: "OPEN",
  simulateFeedback: "ACCEPTED",
},
{
  title: "Raport miesięczny pokazuje nieprawidłowe sumy",
  description: "Klient zauważył, że suma przychodów w raporcie miesięcznym nie zgadza się z sumą pozycji szczegółowych — różnica wynosi około 200 zł.",
  status: "OPEN",
  simulateFeedback: null,
},
{
  title: "Nie można dodać drugiego użytkownika do konta firmowego",
  description: "Administrator konta firmowego próbuje zaprosić nowego pracownika, ale system zwraca błąd 'Osiągnięto limit użytkowników', mimo że plan pozwala na 10 kont.",
  status: "OPEN",
  simulateFeedback: "EDITED",
},
{
  title: "Skanowanie dokumentów tworzy rozmyte obrazy",
  description: "Skaner sieciowy w dziale kadr od tygodnia produkuje rozmyte, nieczytelne skany PDF, mimo że ustawienia rozdzielczości nie zostały zmienione.",
  status: "OPEN",
  simulateFeedback: null,
},
{
  title: "Prośba o fakturę zbiorczą za trzy miesiące",
  description: "Klient prosi o wystawienie jednej zbiorczej faktury za styczeń, luty i marzec zamiast trzech osobnych, ze względu na wymogi swojej księgowości.",
  status: "RESOLVED",
  simulateFeedback: "ACCEPTED",
},
{
  title: "Aplikacja wylogowuje użytkownika co kilka minut",
  description: "Od wczorajszej aktualizacji użytkownicy są automatycznie wylogowywani z panelu co około 5 minut, niezależnie od aktywności w aplikacji.",
  status: "IN_PROGRESS",
  simulateFeedback: "ACCEPTED",
},
{
  title: "Pytanie o dostępność wersji próbnej dla nowego działu",
  description: "Manager pyta, czy istnieje możliwość uruchomienia 14-dniowej wersji próbnej dla nowo utworzonego działu sprzedaży, bez wpływu na obecną subskrypcję firmy.",
  status: "OPEN",
  simulateFeedback: null,
},
{
  title: "Głośnik konferencyjny w sali spotkań nie łączy się przez Bluetooth",
  description: "Sprzętowy głośnik konferencyjny w głównej sali spotkań przestał parować się z laptopami przez Bluetooth po ostatniej aktualizacji firmware.",
  status: "OPEN",
  simulateFeedback: "ACCEPTED",
},
];

const extraDocuments = [
  {
    title: "Instrukcja: Aktualizacje aplikacji mobilnej",
    content: `Procedura wsparcia przy problemach po aktualizacji aplikacji mobilnej

Kategoria: Software | Wersja: 1.0

1. Opis problemu
Po aktualizacji aplikacji mobilnej użytkownicy mogą zgłaszać zawieszanie się
aplikacji, czarny ekran, lub brak reakcji na dotyk w konkretnych zakładkach.

2. Diagnostyka
Ustal: dokładną wersję aplikacji przed i po aktualizacji, model urządzenia
i wersję systemu operacyjnego, czy problem dotyczy konkretnej zakładki czy
całej aplikacji.

3. Kroki postępowania
Krok 1: Poproś użytkownika o wymuszenie zatrzymania aplikacji i ponowne
uruchomienie (nie tylko zamknięcie z listy ostatnich aplikacji).
Krok 2: Jeśli problem nie ustępuje, poproś o odinstalowanie i ponowną
instalację aplikacji ze sklepu.
Krok 3: Sprawdź w wewnętrznym systemie monitoringu, czy inne osoby zgłaszają
ten sam problem z tą samą wersją — może to wskazywać na błąd w wydaniu,
wymagający hotfixa od zespołu deweloperskiego.

4. Kiedy eskalować
Jeśli problem dotyczy więcej niż 5 zgłoszeń w ciągu godziny od wydania
aktualizacji, natychmiast eskaluj do zespołu mobile jako potencjalny
błąd krytyczny wydania.`,
  },
];

async function main() {
  const admin = await prisma.user.findUnique({ where: { email: "admin@nexus.dev" } });
  const agent = await prisma.user.findUnique({ where: { email: "agent@nexus.dev" } });
  if (!admin || !agent) throw new Error("Uruchom najpierw npm run seed (konta użytkowników).");

  console.log("Dodaję dodatkowe dokumenty do bazy wiedzy...");
  for (const doc of extraDocuments) {
    const existing = await prisma.knowledgeDocument.findFirst({ where: { title: doc.title } });
    if (existing) {
      console.log(`⚠ Pominięto (już istnieje): ${doc.title}`);
      continue;
    }
    const document = await prisma.knowledgeDocument.create({
      data: {
        title: doc.title,
        content: doc.content,
        fileType: "TXT",
        status: "PROCESSING",
        fileSizeBytes: Buffer.byteLength(doc.content, "utf-8"),
        uploadedById: admin.id,
      },
    });
    await indexDocument(document.id, doc.content);
    console.log(`✔ Dodano i zaindeksowano: ${doc.title}`);
  }

  console.log("\nTworzę tickety demonstracyjne z prawdziwą analizą AI...");
  for (const item of demoTickets) {
    const existing = await prisma.ticket.findFirst({ where: { title: item.title } });
    if (existing) {
      console.log(`⚠ Pominięto (już istnieje): ${item.title}`);
      continue;
    }

    const ticket = await prisma.$transaction(async (tx) => {
      const t = await tx.ticket.create({
        data: {
          title: item.title,
          description: item.description,
          status: item.status ?? "OPEN",
          assignedToId: item.status !== "OPEN" ? agent.id : null,
          createdById: admin.id,
        },
      });
      await tx.ticketActivity.create({
        data: { ticketId: t.id, actorId: admin.id, type: "CREATED" },
      });
      if (item.status && item.status !== "OPEN") {
        await tx.ticketActivity.create({
          data: {
            ticketId: t.id,
            actorId: admin.id,
            type: "ASSIGNED",
            fromValue: "Nieprzypisany",
            toValue: agent.name,
          },
        });
      }
      return t;
    });

    // Prawdziwa klasyfikacja AI
    const analysisResult = await AIService.classifyTicket(item.title, item.description);
    const analysis = await prisma.aIAnalysis.create({
      data: {
        ticketId: ticket.id,
        model: analysisResult.model,
        promptVersion: analysisResult.promptVersion,
        category: analysisResult.category,
        priority: analysisResult.priority,
        confidence: analysisResult.confidence,
        reasoning: analysisResult.reasoning,
        latencyMs: analysisResult.latencyMs,
        inputTokens: analysisResult.inputTokens,
        outputTokens: analysisResult.outputTokens,
      },
    });

    // Prawdziwa sugestia AI, z realnym RAG retrieval
    const queryEmbedding = await EmbeddingService.embedQuery(
      `${item.title}\n${item.description}`
    );
    const matches = await KnowledgeChunkRepository.searchSimilar(queryEmbedding, 3);
    const relevantMatches = matches.filter((m) => m.distance < RELEVANCE_THRESHOLD);
    const context = relevantMatches.map((m) => ({
      documentTitle: m.documentTitle,
      content: m.content,
    }));
    const suggestionResult = await AIService.suggestResponse(
      item.title,
      item.description,
      context
    );

    await prisma.$transaction(async (tx) => {
      const suggestion = await tx.aISuggestion.create({
        data: {
          ticketId: ticket.id,
          content: suggestionResult.content,
          model: suggestionResult.model,
          promptVersion: suggestionResult.promptVersion,
          latencyMs: suggestionResult.latencyMs,
          inputTokens: suggestionResult.inputTokens,
          outputTokens: suggestionResult.outputTokens,
        },
      });
      if (relevantMatches.length > 0) {
        await tx.aISuggestionSource.createMany({
          data: relevantMatches.map((m) => ({
            suggestionId: suggestion.id,
            documentId: m.documentId,
            documentTitle: m.documentTitle,
            snippet: m.content.slice(0, 200),
            distance: m.distance,
          })),
        });
      }
    });

    // Symulacja decyzji człowieka (dla części ticketów — reszta zostaje
    // celowo bez feedbacku, żeby AI Inbox miał realne pozycje do pokazania)
    if (item.simulateFeedback) {
      const finalCategory: TicketCategory = analysisResult.category;
      const finalPriority: TicketPriority = analysisResult.priority;

      await prisma.$transaction(async (tx) => {
        await tx.aIFeedback.create({
          data: {
            ticketId: ticket.id,
            targetType: "ANALYSIS",
            targetId: analysis.id,
            decision: item.simulateFeedback!,
            reviewedById: admin.id,
          },
        });
         const latestSuggestion = await tx.aISuggestion.findFirst({
          where: { ticketId: ticket.id },
          orderBy: { createdAt: "desc" },
        });
        if (latestSuggestion) {
          await tx.aIFeedback.create({
            data: {
              ticketId: ticket.id,
              targetType: "SUGGESTION",
              targetId: latestSuggestion.id,
              decision: item.simulateFeedback!,
              reviewedById: admin.id,
            },
          });
        }
        await tx.ticket.update({
          where: { id: ticket.id },
          data: { category: finalCategory, priority: finalPriority },
        });
        await tx.ticketActivity.create({
          data: {
            ticketId: ticket.id,
            actorId: admin.id,
            type: "CATEGORY_CHANGED",
            fromValue: "brak",
            toValue: finalCategory,
          },
        });
        await tx.ticketActivity.create({
          data: {
            ticketId: ticket.id,
            actorId: admin.id,
            type: "PRIORITY_CHANGED",
            fromValue: "brak",
            toValue: finalPriority,
          },
        });
      });
    }

    console.log(`✔ ${item.title} → ${analysisResult.category}/${analysisResult.priority}`);
        // Voyage AI ogranicza konta bez metody płatności do 3 zapytań/minutę —
    // odczekujemy między ticketami, żeby nie przekroczyć limitu.
    await new Promise((resolve) => setTimeout(resolve, 22_000));
  }

  console.log("\nGotowe. Dane demonstracyjne dodane.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Błąd podczas seedowania danych demo:", error);
    process.exit(1);
  });