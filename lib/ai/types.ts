import type { TicketCategory, TicketPriority } from "@prisma/client";

export type ClassificationResult = {
  category: TicketCategory;
  priority: TicketPriority;
  confidence: number;
  reasoning: string;
  model: string;
  promptVersion: string;
  latencyMs: number;
  inputTokens?: number;
  outputTokens?: number;
};

export type SuggestionResult = {
  content: string;
  model: string;
  promptVersion: string;
  latencyMs: number;
  inputTokens?: number;
  outputTokens?: number;
};

export type ContextChunk = { documentTitle: string; content: string };

export interface AIProvider {
  classifyTicket(
    title: string,
    description: string
  ): Promise<ClassificationResult>;
  suggestResponse(
    title: string,
    description: string,
    context: ContextChunk[]
  ): Promise<SuggestionResult>;
  extractTicketDraft(transcript: string): Promise<VoiceExtractionResult>;
}
  
export type VoiceExtractionResult = {
  title: string;
  category: TicketCategory;
  priority: TicketPriority;
  description: string;
  suggestedAction: string;
};