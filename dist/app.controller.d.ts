import { Response } from 'express';
import { DocumentIngestionService } from './documents/document-ingestion.service';
import { DocumentRepository } from './documents/document-repository.port';
import { DocumentStatus } from './documents/document-status.enum';
export declare class AppController {
    private readonly ingestionService;
    private readonly repository;
    constructor(ingestionService: DocumentIngestionService, repository: DocumentRepository);
    health(): {
        status: string;
        service: string;
    };
    createDocument(file: any, res: Response): Promise<{
        id: string;
        status: DocumentStatus;
        duplicate: boolean;
    }>;
    listDocuments(status?: DocumentStatus): Promise<import("./documents/document.types").StoredDocument[]>;
    getDocument(id: string): Promise<{
        id: string;
        status: DocumentStatus;
        result: Record<string, unknown> | null;
        confidence: number | null;
        provenance: import("./documents/document.types").ProvenanceSnapshot | null;
    }>;
}
