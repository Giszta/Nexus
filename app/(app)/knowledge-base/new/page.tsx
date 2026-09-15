import { requireRole } from "@/lib/auth-helpers";
import { DocumentUploadForm } from "@/components/knowledge-base/document-upload-form";

export default async function NewDocumentPage() {
  await requireRole(["ADMIN", "MANAGER", "AGENT"]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Nowy dokument</h1>
      <DocumentUploadForm />
    </div>
  );
}