-- CreateTable
CREATE TABLE "ai_analysis" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "promptVersion" TEXT NOT NULL,
    "category" "TicketCategory",
    "priority" "TicketPriority",
    "confidence" DOUBLE PRECISION NOT NULL,
    "reasoning" TEXT,
    "latencyMs" INTEGER NOT NULL,
    "inputTokens" INTEGER,
    "outputTokens" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_analysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ai_analysis_ticketId_idx" ON "ai_analysis"("ticketId");

-- AddForeignKey
ALTER TABLE "ai_analysis" ADD CONSTRAINT "ai_analysis_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
