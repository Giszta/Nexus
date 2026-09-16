import { chunkText } from "./chunking";
import { EmbeddingService } from "@/lib/ai/embedding-service";
import { KnowledgeChunkRepository } from "@/repositories/knowledge-chunk-repository";
import { prisma } from "@/lib/prisma";

export async function indexDocument(documentId: string, content: string) {
  await prisma.knowledgeDocument.update({
    where: { id: documentId },
    data: { status: "INDEXING" },
  });

  try {
    const chunks = chunkText(content);
    const embeddings = await EmbeddingService.embedDocuments(chunks);

    await KnowledgeChunkRepository.createMany(
      documentId,
      chunks.map((content, i) => ({
        content,
        chunkIndex: i,
        embedding: embeddings[i],
      }))
    );

    await prisma.knowledgeDocument.update({
      where: { id: documentId },
      data: { status: "READY" },
    });
  } catch (error) {
    await prisma.knowledgeDocument.update({
      where: { id: documentId },
      data: { status: "FAILED" },
    });
    throw error;
  }
}