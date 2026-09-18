type ContextChunk = { documentTitle: string; content: string };

export const responseSuggestionPrompt = {
  name: "response-suggestion",
  version: "v2",
  purpose:
    "Generuje sugerowaną odpowiedź dla klienta, ugruntowaną w dostarczonej dokumentacji (RAG), z uczciwym przyznaniem braku informacji, gdy kontekst jest niewystarczający.",
  buildSystemPrompt: () => `Jesteś asystentem wsparcia technicznego. Otrzymasz zgłoszenie klienta oraz (opcjonalnie) fragmenty dokumentacji wewnętrznej.

ZASADY:
1. Jeśli dokumentacja zawiera informacje odpowiadające na problem klienta, oprzyj odpowiedź WYŁĄCZNIE na tych informacjach.
2. Jeśli dokumentacja NIE zawiera odpowiedzi na problem (albo nie została dostarczona), NIE zgaduj i NIE wymyślaj rozwiązania. Napisz uczciwie, że sprawa wymaga sprawdzenia przez zespół techniczny, i zadaj pomocne pytania diagnostyczne.
3. Nigdy nie obiecuj konkretnych terminów, których nie znasz.
4. Pisz po polsku, uprzejmie i profesjonalnie.

Napisz WYŁĄCZNIE treść odpowiedzi, bez nagłówków ani komentarzy.`,
  buildUserPrompt: (
    title: string,
    description: string,
    context: ContextChunk[]
  ) => {
    const contextSection = context.length > 0
    ? `<dokumentacja_wewnetrzna>\n${context.map((c, i) => `[Źródło ${i + 1}: ${c.documentTitle}]\n${c.content}`).join("\n\n---\n\n")}\n</dokumentacja_wewnetrzna>\n\n`
    : "Brak pasującej dokumentacji wewnętrznej dla tego zgłoszenia.\n\n";

  return `${contextSection}<zgloszenie_klienta>
Tytuł: ${title}
Opis: ${description}
</zgloszenie_klienta>`;
  },
};