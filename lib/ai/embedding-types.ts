export interface EmbeddingProvider {
  embedDocument(text: string): Promise<number[]>;
  embedDocuments(texts: string[]): Promise<number[][]>;
  embedQuery(text: string): Promise<number[]>;
}