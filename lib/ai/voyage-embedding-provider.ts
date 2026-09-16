import type { EmbeddingProvider } from "./embedding-types";

const VOYAGE_API_URL = "https://api.voyageai.com/v1/embeddings";
const EMBEDDING_DIMENSION = 1024;

async function callVoyageAPI(
  texts: string[],
  inputType: "document" | "query"
): Promise<number[][]> {
  const response = await fetch(VOYAGE_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.VOYAGE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: texts,
      model: "voyage-4-lite",
      input_type: inputType,
      output_dimension: EMBEDDING_DIMENSION,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Voyage API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.data.map((item: { embedding: number[] }) => item.embedding);
}

export class VoyageEmbeddingProvider implements EmbeddingProvider {
  async embedDocument(text: string): Promise<number[]> {
    const [embedding] = await callVoyageAPI([text], "document");
    return embedding;
  }

  async embedDocuments(texts: string[]): Promise<number[][]> {
    return callVoyageAPI(texts, "document");
  }

  async embedQuery(text: string): Promise<number[]> {
    const [embedding] = await callVoyageAPI([text], "query");
    return embedding;
  }
}