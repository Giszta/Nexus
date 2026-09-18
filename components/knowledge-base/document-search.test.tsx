import "@testing-library/jest-dom/vitest";
import { test, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { DocumentSearch } from "./document-search";

const replaceMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock }),
  useSearchParams: () => new URLSearchParams(),
}));

beforeEach(() => {
  replaceMock.mockClear();
});

afterEach(() => {
  cleanup();
});

test("nie wywołuje wyszukiwania natychmiast po wpisaniu znaku", () => {
  render(<DocumentSearch />);
  const input = screen.getByPlaceholderText("Szukaj po tytule...");

  fireEvent.change(input, { target: { value: "faktura" } });

  expect(replaceMock).not.toHaveBeenCalled();
});

test("wywołuje router.replace z frazą po upływie czasu debounce", async () => {
  render(<DocumentSearch />);
  const input = screen.getByPlaceholderText("Szukaj po tytule...");

  fireEvent.change(input, { target: { value: "faktura" } });

  await waitFor(
    () => {
      expect(replaceMock).toHaveBeenCalledWith(
        expect.stringContaining("search=faktura"),
        expect.anything()
      );
    },
    { timeout: 1000 }
  );
});