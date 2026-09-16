"use server";

import { EmbeddingService } from "@/lib/ai/embedding-service";
import { KnowledgeChunkRepository } from "@/repositories/knowledge-chunk-repository";

export async function searchKnowledgeBase(query: string) {
  const queryEmbedding = await EmbeddingService.embedQuery(query);
  return KnowledgeChunkRepository.searchSimilar(queryEmbedding, 5);
}
