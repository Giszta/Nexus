-- CreateEnum
CREATE TYPE "FeedbackDecision" AS ENUM ('ACCEPTED', 'EDITED', 'REJECTED');

-- CreateEnum
CREATE TYPE "FeedbackTargetType" AS ENUM ('ANALYSIS', 'SUGGESTION');

-- AlterEnum
ALTER TYPE "TicketActivityType" ADD VALUE 'CATEGORY_CHANGED';

-- CreateTable
CREATE TABLE "ai_feedback" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "targetType" "FeedbackTargetType" NOT NULL,
    "targetId" TEXT NOT NULL,
    "decision" "FeedbackDecision" NOT NULL,
    "editedCategory" "TicketCategory",
    "editedPriority" "TicketPriority",
    "editedContent" TEXT,
    "reviewedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ai_feedback_ticketId_idx" ON "ai_feedback"("ticketId");

-- CreateIndex
CREATE INDEX "ai_feedback_targetType_targetId_idx" ON "ai_feedback"("targetType", "targetId");

-- AddForeignKey
ALTER TABLE "ai_feedback" ADD CONSTRAINT "ai_feedback_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_feedback" ADD CONSTRAINT "ai_feedback_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
