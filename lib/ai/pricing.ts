// Ceny w USD za 1M tokenów. Zweryfikowane 17.09.2026.
// Źródła: https://platform.claude.com/docs/en/about-claude/pricing (Claude)
//         https://www.voyageai.com/pricing (Voyage AI)
const PRICING: Record<string, { input: number; output: number }> = {
  "claude-haiku-4-5-20251001": { input: 1.0, output: 5.0 },
  "voyage-4-lite": { input: 0.02, output: 0 },
};

export function estimateCost(
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  const pricing = PRICING[model];
  if (!pricing) return 0;
  return (
    (inputTokens / 1_000_000) * pricing.input +
    (outputTokens / 1_000_000) * pricing.output
  );
}