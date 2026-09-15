import { MockAIProvider } from "./mock-provider";
import { AnthropicProvider } from "./anthropic-provider";
import type { AIProvider } from "./types";

function createProvider(): AIProvider {
  if (process.env.AI_PROVIDER === "anthropic") {
    return new AnthropicProvider();
  }
  return new MockAIProvider();
}

export const AIService = createProvider();