import { KnowledgeSearchForm } from "@/components/knowledge-base/knowledge-search-form";

export default function KnowledgeSearchPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Wyszukiwanie semantyczne</h1>
      <p className="text-sm text-muted-foreground">
        Testowa strona do weryfikacji RAG — wpisz pytanie własnymi słowami,
        nawet jeśli nie pokrywają się dosłownie z treścią dokumentów.
      </p>
      <KnowledgeSearchForm />
    </div>
  );
}