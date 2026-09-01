import { Document } from '@prisma/client';
import { DocumentStatus } from '../../documents/document-status.enum';
type DocumentRecord = Omit<Document, 'createdAt' | 'updatedAt'> & {
    createdAt: Date;
    updatedAt: Date;
};
export declare class MockPrismaRepository {
    private documents;
    findById(id: string): Promise<DocumentRecord | null>;
    findByContentHash(contentHash: string): Promise<DocumentRecord | null>;
    create(data: {
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
    }): Promise<DocumentRecord>;
    updateStatus(id: string, status: DocumentStatus, result?: string, confidence?: number, provenance?: string): Promise<DocumentRecord | null>;
    findByStatus(status: DocumentStatus): Promise<DocumentRecord[]>;
    deleteMany(where: {
        contentHash?: string;
    }): Promise<{
        count: number;
    }>;
    clear(): Promise<void>;
    count(): Promise<number>;
    getAll(): DocumentRecord[];
}
export declare const createMockPrismaRepository: () => MockPrismaRepository;
export {};
