import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

function toVectorLiteral(embedding: number[]): string {
  return `[${embedding.join(",")}]`;
}

export const KnowledgeChunkRepository = {
  async createMany(
    documentId: string,
    chunks: { content: string; chunkIndex: number; embedding: number[] }[]
  ) {
    for (const chunk of chunks) {
      await prisma.$executeRaw`
        INSERT INTO knowledge_chunk (id, content, "chunkIndex", embedding, "documentId", "createdAt")
        VALUES (
          ${randomUUID()},
          ${chunk.content},
          ${chunk.chunkIndex},
          ${toVectorLiteral(chunk.embedding)}::vector,
          ${documentId},
          NOW()
        )
      `;
    }
  },

async searchSimilar(queryEmbedding: number[], topK: number = 5) {
  const vectorLiteral = toVectorLiteral(queryEmbedding);

  return prisma.$queryRaw<
    { id: string; content: string; documentId: string; documentTitle: string; distance: number }[]
  >`
    SELECT
      kc.id,
      kc.content,
      kc."documentId",
      kd.title AS "documentTitle",
      kc.embedding <=> ${vectorLiteral}::vector AS distance
    FROM knowledge_chunk kc
    JOIN knowledge_document kd ON kd.id = kc."documentId"
    ORDER BY distance ASC
    LIMIT ${topK}
  `;
},
};