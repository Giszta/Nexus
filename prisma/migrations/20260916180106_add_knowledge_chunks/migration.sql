-- CreateTable
CREATE TABLE "knowledge_chunk" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "chunkIndex" INTEGER NOT NULL,
    "embedding" vector(1024),
    "documentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "knowledge_chunk_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "knowledge_chunk_documentId_idx" ON "knowledge_chunk"("documentId");

-- AddForeignKey
ALTER TABLE "knowledge_chunk" ADD CONSTRAINT "knowledge_chunk_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "knowledge_document"("id") ON DELETE CASCADE ON UPDATE CASCADE;
