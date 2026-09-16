const CHUNK_SIZE = 1000; // znaków
const CHUNK_OVERLAP = 150; // znaków

export function chunkText(text: string): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + CHUNK_SIZE, text.length);
    chunks.push(text.slice(start, end).trim());

    if (end === text.length) break;
    start = end - CHUNK_OVERLAP;
  }

  return chunks.filter((chunk) => chunk.length > 0);
}