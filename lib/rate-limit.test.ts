import { test, expect, beforeEach, vi } from "vitest";
import { checkRateLimit } from "./rate-limit";

const config = { maxRequests: 3, windowMs: 60_000 };

beforeEach(() => {
  vi.useRealTimers();
});

test("pozwala na żądania do osiągnięcia limitu", () => {
  const key = `test-key-${Date.now()}-a`;
  expect(checkRateLimit(key, config).allowed).toBe(true);
  expect(checkRateLimit(key, config).allowed).toBe(true);
  expect(checkRateLimit(key, config).allowed).toBe(true);
});

test("blokuje żądanie po przekroczeniu limitu", () => {
  const key = `test-key-${Date.now()}-b`;
  checkRateLimit(key, config);
  checkRateLimit(key, config);
  checkRateLimit(key, config);

  const fourth = checkRateLimit(key, config);
  expect(fourth.allowed).toBe(false);
  expect(fourth.retryAfterSeconds).toBeGreaterThan(0);
});

test("zwalnia limit po upływie okna czasowego", () => {
  vi.useFakeTimers();
  const key = `test-key-${Date.now()}-c`;

  checkRateLimit(key, config);
  checkRateLimit(key, config);
  checkRateLimit(key, config);
  expect(checkRateLimit(key, config).allowed).toBe(false);

  vi.advanceTimersByTime(61_000);

  expect(checkRateLimit(key, config).allowed).toBe(true);

  vi.useRealTimers();
});