-- CreateTable
CREATE TABLE "ai_suggestion_source" (
    "id" TEXT NOT NULL,
    "suggestionId" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "documentTitle" TEXT NOT NULL,
    "snippet" TEXT NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_suggestion_source_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ai_suggestion_source_suggestionId_idx" ON "ai_suggestion_source"("suggestionId");

-- AddForeignKey
ALTER TABLE "ai_suggestion_source" ADD CONSTRAINT "ai_suggestion_source_suggestionId_fkey" FOREIGN KEY ("suggestionId") REFERENCES "ai_suggestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
