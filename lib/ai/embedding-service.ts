import { MockEmbeddingProvider } from "./mock-embedding-provider";
import { VoyageEmbeddingProvider } from "./voyage-embedding-provider";
import type { EmbeddingProvider } from "./embedding-types";

function createEmbeddingProvider(): EmbeddingProvider {
  if (process.env.AI_PROVIDER === "anthropic") {
    return new VoyageEmbeddingProvider();
  }
  return new MockEmbeddingProvider();
}

export const EmbeddingService = createEmbeddingProvider();