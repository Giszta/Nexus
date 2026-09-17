import { prisma } from "@/lib/prisma";
import type { DocumentFileType, DocumentStatus } from "@prisma/client";

type ListParams = {
  page?: number;
  pageSize?: number;
  search?: string;
};

export const KnowledgeDocumentRepository = {
  async list({ page = 1, pageSize = 10, search }: ListParams = {}) {
    const where = search
      ? { title: { contains: search, mode: "insensitive" as const } }
      : {};

    const [documents, total] = await Promise.all([
      prisma.knowledgeDocument.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { uploadedBy: { select: { name: true } } },
      }),
      prisma.knowledgeDocument.count({ where }),
    ]);

    return {
      documents,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  },

  async findById(id: string) {
    return prisma.knowledgeDocument.findUnique({
      where: { id },
      include: { uploadedBy: { select: { name: true } } },
    });
  },


async create(data: {
  title: string;
  content: string;
  fileType: DocumentFileType;
  fileSizeBytes: number;
  uploadedById: string;
}) {
    return prisma.knowledgeDocument.create({
      data: { ...data, status: "PROCESSING" },
    });
  },

  async delete(id: string) {
    return prisma.knowledgeDocument.delete({ where: { id } });
  },
};