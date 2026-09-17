"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { KnowledgeDocumentRepository } from "@/repositories/knowledge-document-repository";
import {
  uploadDocumentSchema,
  MAX_TEXT_FILE_SIZE_BYTES,
  MAX_PDF_FILE_SIZE_BYTES,
  ALLOWED_EXTENSIONS,
  ALLOWED_MIME_TYPES,
} from "@/schemas/knowledge-document";
import { indexDocument } from "@/lib/rag/index-document";

export async function uploadDocument(formData: FormData) {
  const session = await getServerSession();
  if (!session) redirect("/login");

  const role = (session.user as { role?: string }).role;
  if (role === "VIEWER") {
    throw new Error("Brak uprawnień do dodawania dokumentów.");
  }

  const parsed = uploadDocumentSchema.safeParse({
    title: formData.get("title"),
  });
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const file = formData.get("file") as File | null;

  if (!file || file.size === 0) {
    return { error: { file: ["Wybierz plik do przesłania."] } };
  }

 const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
if (!ALLOWED_EXTENSIONS.includes(extension)) {
  return {
    error: { file: [`Dozwolone rozszerzenia: ${ALLOWED_EXTENSIONS.join(", ")}`] },
  };
}

if (file.type && !ALLOWED_MIME_TYPES.includes(file.type)) {
  return { error: { file: ["Nieprawidłowy typ pliku."] } };
}

const isPdf = extension === ".pdf";
const maxSize = isPdf ? MAX_PDF_FILE_SIZE_BYTES : MAX_TEXT_FILE_SIZE_BYTES;

if (file.size > maxSize) {
  return {
    error: { file: [`Plik za duży (maks. ${maxSize / 1024 / 1024} MB).`] },
  };
}

let content: string;
let fileType: "TXT" | "MARKDOWN" | "PDF";

if (isPdf) {
  const { extractText } = await import("unpdf");
  const buffer = new Uint8Array(await file.arrayBuffer());
  const { text } = await extractText(buffer, { mergePages: true });
  content = text;
  fileType = "PDF";
} else {
  content = await file.text();
  fileType = extension === ".md" ? "MARKDOWN" : "TXT";
}

if (!content || content.trim().length === 0) {
  return {
    error: { file: ["Nie udało się wyodrębnić tekstu z pliku (plik może być pusty lub zeskanowanym obrazem bez warstwy tekstowej)."] },
  };
}

const document = await KnowledgeDocumentRepository.create({
  title: parsed.data.title,
  content,
  fileType,
  fileSizeBytes: file.size,
  uploadedById: session.user.id,
});

await indexDocument(document.id, content);

revalidatePath("/knowledge-base");
redirect(`/knowledge-base/${document.id}`);
}
export async function deleteDocument(id: string) {
  const session = await getServerSession();
  if (!session) redirect("/login");

  const role = (session.user as { role?: string }).role;
  if (role !== "ADMIN" && role !== "MANAGER") {
    throw new Error("Brak uprawnień do usuwania dokumentów.");
  }

  await KnowledgeDocumentRepository.delete(id);
  revalidatePath("/knowledge-base");
  redirect("/knowledge-base");
}
