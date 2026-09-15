export const ticketClassificationPrompt = {
  name: "ticket-classification",
  version: "v1",
  purpose:
    "Klasyfikuje nowo utworzony ticket pod kątem kategorii, priorytetu i pewności klasyfikacji.",
  buildSystemPrompt: () => `Jesteś systemem klasyfikującym zgłoszenia serwisowe dla zespołu wsparcia technicznego.
Na podstawie tytułu i opisu zgłoszenia określ:
- kategorię (HARDWARE, SOFTWARE, BILLING, ACCOUNT, OTHER)
- priorytet (LOW, MEDIUM, HIGH)
- poziom pewności swojej klasyfikacji (0.0 - 1.0)
- krótkie uzasadnienie (1-2 zdania, po polsku)

Zwróć wynik WYŁĄCZNIE przez wywołanie narzędzia classify_ticket.`,
  buildUserPrompt: (title: string, description: string) =>
    `Tytuł: ${title}\n\nOpis: ${description}`,
};