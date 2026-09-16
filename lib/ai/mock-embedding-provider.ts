import type { EmbeddingProvider } from "./embedding-types";

export class MockEmbeddingProvider implements EmbeddingProvider {
  private hashToVector(text: string): number[] {
    const vector = new Array(1024).fill(0);
    for (let i = 0; i < text.length; i++) {
      vector[i % 1024] += text.charCodeAt(i) / 1000;
    }
    return vector;
  }

  async embedDocument(text: string): Promise<number[]> {
    return this.hashToVector(text);
  }

  async embedDocuments(texts: string[]): Promise<number[][]> {
    return texts.map((t) => this.hashToVector(t));
  }

  async embedQuery(text: string): Promise<number[]> {
    return this.hashToVector(text);
  }
}