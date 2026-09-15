import Link from "next/link";
import { KnowledgeDocumentRepository } from "@/repositories/knowledge-document-repository";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { DocumentSearch } from "@/components/knowledge-base/document-search";

export default async function KnowledgeBasePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? "1");
  const search = params.search;

  const { documents, totalPages } = await KnowledgeDocumentRepository.list({
    page,
    search,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Knowledge Base</h1>
        <Button asChild>
          <Link href="/knowledge-base/new">Nowy dokument</Link>
        </Button>
      </div>

<DocumentSearch initialValue={search} />

      {documents.length === 0 ? (
        <p className="text-muted-foreground">Brak dokumentów.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tytuł</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Typ</TableHead>
              <TableHead>Dodał</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>
                  <Link href={`/knowledge-base/${doc.id}`} className="hover:underline">
                    {doc.title}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant={doc.status === "READY" ? "default" : "outline"}>
                    {doc.status}
                  </Badge>
                </TableCell>
                <TableCell>{doc.fileType}</TableCell>
                <TableCell>{doc.uploadedBy.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <p className="text-sm text-muted-foreground">
        Strona {page} z {totalPages || 1}
      </p>
    </div>
  );
}