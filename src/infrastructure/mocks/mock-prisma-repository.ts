/**
 * Mock Prisma Repository
 *
 * Simula o comportamento de um repositório Prisma para testes em ambiente
 * de desenvolvimento sem necessidade de banco de dados real.
 *
 * Armazena dados em memória.
 */

import { Document } from '@prisma/client';
import { DocumentStatus } from '../../documents/document-status.enum';

type DocumentRecord = Omit<Document, 'createdAt' | 'updatedAt'> & {
  createdAt: Date;
  updatedAt: Date;
};

export class MockPrismaRepository {
  private documents: Map<string, DocumentRecord> = new Map();

  async findById(id: string): Promise<DocumentRecord | null> {
    return this.documents.get(id) || null;
  }

  async findByContentHash(contentHash: string): Promise<DocumentRecord | null> {
    for (const doc of this.documents.values()) {
      if (doc.contentHash === contentHash) {
        return doc;
      }
    }
    return null;
  }

  async create(data: {
    id: string;
    filename: string;
    contentHash: string;
    mimeType: string;
    storagePath?: string;
    status: DocumentStatus;
    attempts?: number;
    result?: string | null;
    confidence?: number | null;
    provenance?: string | null;
    errorType?: string | null;
    lastError?: string | null;
  }): Promise<DocumentRecord> {
    const now = new Date();
    const document: DocumentRecord = {
      id: data.id,
      filename: data.filename,
      contentHash: data.contentHash,
      mimeType: data.mimeType,
      storagePath: data.storagePath ?? `storage/${data.id}`,
      status: data.status,
      attempts: data.attempts ?? 0,
      result: data.result ?? null,
      confidence: data.confidence ?? null,
      provenance: data.provenance ?? null,
      errorType: data.errorType ?? null,
      lastError: data.lastError ?? null,
      createdAt: now,
      updatedAt: now,
    };

    this.documents.set(data.id, document);
    return document;
  }

  async updateStatus(
    id: string,
    status: DocumentStatus,
    result?: string,
    confidence?: number,
    provenance?: string,
  ): Promise<DocumentRecord | null> {
    const doc = this.documents.get(id);
    if (!doc) {
      return null;
    }

    const updated: DocumentRecord = {
      ...doc,
      status,
      result: result ?? doc.result,
      confidence: confidence ?? doc.confidence,
      provenance: provenance ?? doc.provenance,
      updatedAt: new Date(),
    };

    this.documents.set(id, updated);
    return updated;
  }

  async findByStatus(status: DocumentStatus): Promise<DocumentRecord[]> {
    return Array.from(this.documents.values()).filter((doc) => doc.status === status);
  }

  async deleteMany(where: { contentHash?: string }): Promise<{ count: number }> {
    if (where.contentHash) {
      let deleted = 0;
      for (const [id, doc] of this.documents.entries()) {
        if (doc.contentHash === where.contentHash) {
          this.documents.delete(id);
          deleted++;
        }
      }
      return { count: deleted };
    }
    return { count: 0 };
  }

  async clear(): Promise<void> {
    this.documents.clear();
  }

  async count(): Promise<number> {
    return this.documents.size;
  }

  getAll(): DocumentRecord[] {
    return Array.from(this.documents.values());
  }
}

export const createMockPrismaRepository = () => {
  return new MockPrismaRepository();
};
