import { z } from "zod";

export const MAX_TEXT_FILE_SIZE_BYTES = 500 * 1024; // 500 KB — TXT/Markdown
export const MAX_PDF_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB — PDF

export const ALLOWED_EXTENSIONS = [".txt", ".md", ".pdf"];
export const ALLOWED_MIME_TYPES = ["text/plain", "text/markdown", "application/pdf"];

export const uploadDocumentSchema = z.object({
  title: z.string().min(3, "Tytuł musi mieć co najmniej 3 znaki").max(200),
});