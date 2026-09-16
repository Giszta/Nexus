"use client";

import { useState, useTransition } from "react";
import { searchKnowledgeBase } from "@/app/(app)/knowledge-base/search/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Result = {
  id: string;
  content: string;
  documentId: string;
  documentTitle: string;
  distance: number;
};

export function KnowledgeSearchForm() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [isPending, startTransition] = useTransition();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const data = await searchKnowledgeBase(query);
      setResults(data);
    });
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="np. co zrobić gdy nie mogę się zalogować?"
        />
        <Button type="submit" disabled={isPending || !query}>
          {isPending ? "Szukam..." : "Szukaj"}
        </Button>
      </form>

      <div className="space-y-3">
        {results.map((result) => (
          <Card key={result.id}>
            <CardContent className="space-y-1 pt-4 text-sm">
              <div className="flex items-center justify-between">
                <p className="font-medium">{result.documentTitle}</p>
                <p className="text-xs text-muted-foreground">
                  odległość: {result.distance.toFixed(4)}
                </p>
              </div>
              <p className="text-muted-foreground">{result.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}