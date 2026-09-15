import { z } from "zod";

export const MAX_FILE_SIZE_BYTES = 500 * 1024; // 500 KB
export const ALLOWED_EXTENSIONS = [".txt", ".md"];
export const ALLOWED_MIME_TYPES = ["text/plain", "text/markdown"];

export const uploadDocumentSchema = z.object({
  title: z.string().min(3, "Tytuł musi mieć co najmniej 3 znaki").max(200),
});