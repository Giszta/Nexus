import Anthropic from "@anthropic-ai/sdk";
import type { AIProvider, ClassificationResult, SuggestionResult } from "./types";
import { ticketClassificationPrompt } from "@/prompts/ticket-classification";
import { responseSuggestionPrompt } from "@/prompts/response-suggestion";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const CLASSIFY_TOOL = {
  name: "classify_ticket",
  description: "Zwraca klasyfikację zgłoszenia serwisowego.",
  input_schema: {
    type: "object" as const,
    properties: {
      category: {
        type: "string",
        enum: ["HARDWARE", "SOFTWARE", "BILLING", "ACCOUNT", "OTHER"],
      },
      priority: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"] },
      confidence: { type: "number", description: "Od 0.0 do 1.0" },
      reasoning: { type: "string", description: "Krótkie uzasadnienie po polsku" },
    },
    required: ["category", "priority", "confidence", "reasoning"],
  },
};

export class AnthropicProvider implements AIProvider {
  async classifyTicket(
    title: string,
    description: string
  ): Promise<ClassificationResult> {
    const start = Date.now();

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      system: ticketClassificationPrompt.buildSystemPrompt(),
      messages: [
        {
          role: "user",
          content: ticketClassificationPrompt.buildUserPrompt(title, description),
        },
      ],
      tools: [CLASSIFY_TOOL],
      tool_choice: { type: "tool", name: "classify_ticket" },
    });

    const toolUseBlock = response.content.find(
      (block) => block.type === "tool_use"
    );

    if (!toolUseBlock || toolUseBlock.type !== "tool_use") {
      throw new Error("Model nie zwrócił oczekiwanej struktury danych.");
    }

const result = toolUseBlock.input as {
  category: ClassificationResult["category"];
  priority: ClassificationResult["priority"];
  confidence: number;
  reasoning: string;
};
    return {
      ...result,
      model: response.model,
      promptVersion: ticketClassificationPrompt.version,
      latencyMs: Date.now() - start,
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
    };
  }
  async suggestResponse(
  title: string,
  description: string
): Promise<SuggestionResult> {
  const start = Date.now();

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 300,
    system: responseSuggestionPrompt.buildSystemPrompt(),
    messages: [
      {
        role: "user",
        content: responseSuggestionPrompt.buildUserPrompt(title, description),
      },
    ],
  });

  const textBlock = response.content.find((block) => block.type === "text");

  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Model nie zwrócił odpowiedzi tekstowej.");
  }

  return {
    content: textBlock.text,
    model: response.model,
    promptVersion: responseSuggestionPrompt.version,
    latencyMs: Date.now() - start,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
  };
}
}