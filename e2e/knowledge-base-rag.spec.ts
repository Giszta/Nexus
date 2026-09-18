import path from "path";
import { test, expect } from "@playwright/test";

test("login → upload dokumentu → indeksowanie → wyszukiwanie semantyczne", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("admin@nexus.dev");
  await page.getByLabel("Hasło").fill("Password123!");
  await page.getByRole("button", { name: "Zaloguj się" }).click();
  await expect(page).toHaveURL(/\/dashboard/);

  // Upload dokumentu
  await page.goto("/knowledge-base/new");
  const uniqueTitle = `E2E Reset Hasła ${Date.now()}`;
  await page.getByLabel(/Tytuł dokumentu/).fill(uniqueTitle);

  const filePath = path.join(__dirname, "fixtures/sample-document.txt");
  await page.locator('input[type="file"]').setInputFiles(filePath);
  await page.getByRole("button", { name: "Prześlij dokument" }).click();

  // Weryfikacja: status READY po zakończeniu indeksowania
  await expect(page).toHaveURL(/\/knowledge-base\/[a-z0-9]+$/);
  await expect(page.getByText("READY")).toBeVisible();
  await expect(page.getByRole("heading", { name: uniqueTitle })).toBeVisible();

  // Wyszukiwanie semantyczne
  await page.goto("/knowledge-base/search");
  await page
    .getByPlaceholder(/np\. co zrobić/)
    .fill("zapomniałem hasła, co robić?");
  await page.getByRole("button", { name: "Szukaj" }).click();

  await expect(page.getByText(uniqueTitle)).toBeVisible({ timeout: 5000 });
});