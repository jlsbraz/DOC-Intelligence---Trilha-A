import { Response } from 'express';
import { DocumentIngestionService } from './documents/document-ingestion.service';
import { DocumentRepository } from './documents/document-repository.port';
import { DocumentStatus } from './documents/document-status.enum';
export declare class AppController {
    private readonly ingestionService;
    private readonly repository;
    constructor(ingestionService: DocumentIngestionService, repository: DocumentRepository);
    createDocument(file: any, res: Response): Promise<{
        id: string;
        status: DocumentStatus;
        duplicate: boolean;
    }>;
    getDocument(id: string): Promise<{
        id: string;
        status: DocumentStatus;
        result: Record<string, unknown> | null;
        confidence: number | null;
        provenance: import("./documents/document.types").ProvenanceSnapshot | null;
    }>;
    listDocuments(status?: DocumentStatus): Promise<import("./documents/document.types").StoredDocument[]>;
}
