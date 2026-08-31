import { Injectable } from '@nestjs/common';
import { DocumentRepository } from '../documents/document-repository.port';
import { DocumentStatus } from '../documents/document-status.enum';
import { StoredDocument } from '../documents/document.types';

// Prisma Client type stub - tipos reais gerados por 'npx prisma generate'
// Para testes, usamos repositório em memória; esta classe é para runtime
declare const PrismaClient: any;

@Injectable()
export class PrismaPostgresRepository extends DocumentRepository {
  private readonly prisma: any;

  constructor() {
    super();
    try {
      // eslint-disable-next-line global-require
      const { PrismaClient: PC } = require('@prisma/client');
      this.prisma = new PC();
    } catch (err) {
      console.warn('Prisma not available (expected in test environment)');
      this.prisma = null;
    }
  }

  async create(document: Omit<StoredDocument, 'createdAt' | 'updatedAt'> & { createdAt?: Date; updatedAt?: Date }): Promise<StoredDocument> {
    const created = await this.prisma.document.create({
      data: {
        id: document.id,
        contentHash: document.contentHash,
        filename: document.filename,
        mimeType: document.mimeType,
        storagePath: document.storagePath,
        status: document.status,
        attempts: document.attempts,
        confidence: document.confidence ?? null,
        result: document.result ?? null,
        provenance: document.provenance ?? null,
        errorType: document.errorType ?? null,
        lastError: document.lastError ?? null,
        createdAt: document.createdAt ?? new Date(),
        updatedAt: document.updatedAt ?? new Date(),
      },
    });

    return this.mapEntity(created);
  }

  async findById(id: string): Promise<StoredDocument | null> {
    const found = await this.prisma.document.findUnique({ where: { id } });
    return found ? this.mapEntity(found) : null;
  }

  async findByContentHash(contentHash: string): Promise<StoredDocument | null> {
    const found = await this.prisma.document.findUnique({ where: { contentHash } });
    return found ? this.mapEntity(found) : null;
  }

  async update(id: string, changes: Partial<StoredDocument>): Promise<StoredDocument | null> {
    const updated = await this.prisma.document.update({
      where: { id },
      data: {
        status: changes.status,
        attempts: changes.attempts,
        confidence: changes.confidence ?? null,
        result: changes.result ?? null,
        provenance: changes.provenance ?? null,
        errorType: changes.errorType ?? null,
        lastError: changes.lastError ?? null,
        updatedAt: changes.updatedAt ?? new Date(),
      },
    });

    return this.mapEntity(updated);
  }

  async listByStatus(status?: DocumentStatus): Promise<StoredDocument[]> {
    const list = await this.prisma.document.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
    });
    return list.map((item: any) => this.mapEntity(item));
  }

  private mapEntity(entity: any): StoredDocument {
    return {
      id: entity.id,
      contentHash: entity.contentHash,
      filename: entity.filename,
      mimeType: entity.mimeType,
      storagePath: entity.storagePath,
      status: entity.status as DocumentStatus,
      attempts: entity.attempts,
      confidence: entity.confidence ?? undefined,
      result: entity.result ?? null,
      provenance: entity.provenance ?? null,
      errorType: entity.errorType ?? null,
      lastError: entity.lastError ?? null,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
