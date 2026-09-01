import { DocumentStatus } from './document-status.enum';
import { DocumentRepository } from './document-repository.port';
import { StoragePort } from './storage-port';
import { DocumentIntelligenceProvider } from './document-intelligence-provider.port';
export type IngestionDependencies = {
    repository: DocumentRepository;
    storage: StoragePort;
    queue: {
        add: (jobName: string, payload: Record<string, unknown>, options?: Record<string, unknown>) => Promise<{
            id: string;
        }>;
    };
    provider: DocumentIntelligenceProvider;
};
export declare class DocumentIngestionService {
    private readonly deps;
    constructor(deps: IngestionDependencies);
    private static computeHash;
    ingestDocument(file: {
        buffer: Buffer;
        originalname: string;
        mimetype?: string;
    }): Promise<{
        id: string;
        status: DocumentStatus;
        existing: boolean;
    }>;
}
