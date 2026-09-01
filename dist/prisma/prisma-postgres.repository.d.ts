import { DocumentRepository } from '../documents/document-repository.port';
import { DocumentStatus } from '../documents/document-status.enum';
import { StoredDocument } from '../documents/document.types';
export declare class PrismaPostgresRepository extends DocumentRepository {
    private readonly prisma;
    constructor();
    create(document: Omit<StoredDocument, 'createdAt' | 'updatedAt'> & {
        createdAt?: Date;
        updatedAt?: Date;
    }): Promise<StoredDocument>;
    findById(id: string): Promise<StoredDocument | null>;
    findByContentHash(contentHash: string): Promise<StoredDocument | null>;
    update(id: string, changes: Partial<StoredDocument>): Promise<StoredDocument | null>;
    listByStatus(status?: DocumentStatus): Promise<StoredDocument[]>;
    private mapEntity;
}
