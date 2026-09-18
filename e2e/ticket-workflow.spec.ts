import { test, expect } from "@playwright/test";

test("login → utworzenie ticketu → analiza AI → akceptacja → zmiana statusu", async ({
  page,
}) => {
  // 1. Logowanie
  await page.goto("/login");
  await page.getByLabel("Email").fill("admin@nexus.dev");
  await page.getByLabel("Hasło").fill("Password123!");
  await page.getByRole("button", { name: "Zaloguj się" }).click();
  await expect(page).toHaveURL(/\/dashboard/);

  // 2. Utworzenie ticketu
  await page.goto("/tickets/new");
  const uniqueTitle = `E2E Test Ticket ${Date.now()}`;
  await page.getByLabel("Tytuł").fill(uniqueTitle);
  await page
    .getByLabel("Opis")
    .fill("Opis wygenerowany przez test E2E, wystarczająco długi.");
  await page.getByRole("button", { name: "Utwórz ticket" }).click();

  await expect(page).toHaveURL(/\/tickets\/[a-z0-9]+$/);
  await expect(page.getByRole("heading", { name: uniqueTitle })).toBeVisible();

  // 3. Analiza AI (MockAIProvider — deterministyczna, szybka)
  await page.getByRole("button", { name: "Analizuj" }).click();
  await expect(page.getByText("Kategoria")).toBeVisible();
  await expect(page.getByText(/OTHER|SOFTWARE|HARDWARE|BILLING|ACCOUNT/)).toBeVisible();

  // 4. Akceptacja sugestii AI
  await page.getByRole("button", { name: "Akceptuj" }).first().click();
  await expect(page.getByText("Zaakceptowano")).toBeVisible();

  // 5. Zmiana statusu ticketu
  await page.getByRole("combobox").first().click();
  await page.getByRole("option", { name: "W trakcie" }).click();
  await expect(page.getByText("zmienił(a) status")).toBeVisible();
});