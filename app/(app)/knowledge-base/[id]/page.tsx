import { notFound } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { KnowledgeDocumentRepository } from "@/repositories/knowledge-document-repository";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DeleteDocumentButton } from "@/components/knowledge-base/delete-document-button";

export default async function DocumentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession();
  const role = (session?.user as { role?: string })?.role;
  const canDelete = role === "ADMIN" || role === "MANAGER";

  const document = await KnowledgeDocumentRepository.findById(id);

  if (!document) {
    notFound();
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="outline">{document.fileType}</Badge>
            <Badge variant={document.status === "READY" ? "default" : "outline"}>
              {document.status}
            </Badge>
          </div>
          <h1 className="text-2xl font-semibold">{document.title}</h1>
          <p className="text-sm text-muted-foreground">
            Dodał: {document.uploadedBy.name} ·{" "}
            {document.createdAt.toLocaleDateString("pl-PL")} ·{" "}
            {(document.fileSizeBytes / 1024).toFixed(1)} KB
          </p>
        </div>
        {canDelete && <DeleteDocumentButton documentId={document.id} />}
      </div>

      <Card>
        <CardContent className="pt-6">
          <pre className="whitespace-pre-wrap font-sans text-sm">
            {document.content}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}