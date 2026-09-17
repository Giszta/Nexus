import { responseSuggestionPrompt } from "@/prompts/response-suggestion";
import type { AIProvider, ClassificationResult, SuggestionResult } from "./types";
import { ticketClassificationPrompt } from "@/prompts/ticket-classification";

export class MockAIProvider implements AIProvider {
  async classifyTicket(
    title: string,
    description: string
  ): Promise<ClassificationResult> {
    const start = Date.now();
    const text = `${title} ${description}`.toLowerCase();

    let category: ClassificationResult["category"] = "OTHER";
    if (/hasło|logowanie|konto/.test(text)) category = "ACCOUNT";
    else if (/płatność|faktura|rachunek/.test(text)) category = "BILLING";
    else if (/aplikacja|błąd|nie działa|oprogramowanie/.test(text))
      category = "SOFTWARE";
    else if (/sprzęt|drzwi|zawias|urządzenie/.test(text)) category = "HARDWARE";

    const priority: ClassificationResult["priority"] = /pilne|krytyczne|natychmiast/.test(
      text
    )
      ? "HIGH"
      : "MEDIUM";

    await new Promise((resolve) => setTimeout(resolve, 300));

    return {
      category,
      priority,
      confidence: 0.75,
      reasoning:
        "Klasyfikacja wygenerowana przez MockAIProvider (tryb deweloperski, brak prawdziwego AI).",
      model: "mock-provider",
      promptVersion: ticketClassificationPrompt.version,
      latencyMs: Date.now() - start,
    };
  }
  async suggestResponse(
  title: string,
  description: string,
  context: ContextChunk[]
): Promise<SuggestionResult> {
  const start = Date.now();
  await new Promise((resolve) => setTimeout(resolve, 300));

  const grounded =
    context.length > 0
      ? ` Znaleziono ${context.length} pasujący(e) fragment(y) dokumentacji.`
      : " Brak pasującej dokumentacji — wymaga sprawdzenia przez zespół.";

  return {
    content: `Dziękujemy za zgłoszenie "${title}".${grounded} [MockAIProvider]`,
    model: "mock-provider",
    promptVersion: responseSuggestionPrompt.version,
    latencyMs: Date.now() - start,
  };
}
}
