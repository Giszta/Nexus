export const voiceExtractionPrompt = {
  name: "voice-extraction",
  version: "v1",
  purpose:
    "Wyodrębnia strukturalne dane ticketu z transkrypcji nagrania głosowego agenta.",
  buildSystemPrompt: () => `Jesteś asystentem, który słucha (w formie transkrypcji) relacji agenta wsparcia technicznego o problemie klienta i przekształca ją w strukturalny szkic zgłoszenia.

Wyodrębnij:
- title: krótki, konkretny tytuł zgłoszenia (po polsku)
- category: HARDWARE, SOFTWARE, BILLING, ACCOUNT lub OTHER
- priority: LOW, MEDIUM lub HIGH
- description: pełny, uporządkowany opis problemu na podstawie transkrypcji
- suggestedAction: krótka sugestia następnego kroku dla zespołu

Transkrypcja może zawierać potknięcia językowe typowe dla mowy — zignoruj je i wyciągnij sens.

Zwróć wynik WYŁĄCZNIE przez wywołanie narzędzia extract_ticket_draft.`,
buildUserPrompt: (transcript: string) => `<transkrypcja>
${transcript}
</transkrypcja>`,
};