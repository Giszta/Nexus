import { test, expect } from "vitest";
import { createTicketSchema } from "./ticket";

test("akceptuje poprawne dane ticketu", () => {
  const result = createTicketSchema.safeParse({
    title: "Problem z logowaniem",
    description: "Użytkownik nie może się zalogować od wczoraj.",
  });
  expect(result.success).toBe(true);
});

test("odrzuca zbyt krótki tytuł", () => {
  const result = createTicketSchema.safeParse({
    title: "abc",
    description: "Wystarczająco długi opis problemu użytkownika.",
  });
  expect(result.success).toBe(false);
});

test("odrzuca zbyt krótki opis", () => {
  const result = createTicketSchema.safeParse({
    title: "Poprawny tytuł zgłoszenia",
    description: "krótki",
  });
  expect(result.success).toBe(false);
});

test("akceptuje brak priorytetu i kategorii (opcjonalne)", () => {
  const result = createTicketSchema.safeParse({
    title: "Poprawny tytuł zgłoszenia",
    description: "Wystarczająco długi opis problemu użytkownika.",
  });
  expect(result.success).toBe(true);
});

test("odrzuca nieprawidłową wartość priorytetu", () => {
  const result = createTicketSchema.safeParse({
    title: "Poprawny tytuł zgłoszenia",
    description: "Wystarczająco długi opis problemu użytkownika.",
    priority: "SUPER_PILNE",
  });
  expect(result.success).toBe(false);
});