import { test, expect } from "vitest";
import { chunkText } from "./chunking";

test("dzieli krótki tekst na jeden chunk", () => {
  const result = chunkText("Krótki tekst poniżej limitu.");
  expect(result).toHaveLength(1);
  expect(result[0]).toBe("Krótki tekst poniżej limitu.");
});

test("dzieli długi tekst na wiele chunków z zachowaniem overlapu", () => {
  const longText = "a".repeat(2500);
  const result = chunkText(longText);

  expect(result.length).toBeGreaterThan(1);
});

test("nie zwraca pustych chunków", () => {
  const result = chunkText("   ");
  expect(result.every((chunk) => chunk.length > 0)).toBe(true);
});

test("zwraca pustą tablicę dla pustego tekstu", () => {
  const result = chunkText("");
  expect(result).toEqual([]);
});