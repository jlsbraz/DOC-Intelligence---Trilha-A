import { RetryErrorClassifier } from './retry-error-classifier';
import { TrustPolicyService } from './trust-policy.service';
import { DocumentIntelligenceProvider } from './document-intelligence-provider.port';
import { DocumentRepository } from './document-repository.port';
export type ProcessingDependencies = {
    repository: DocumentRepository;
    provider: DocumentIntelligenceProvider;
    trustPolicy: TrustPolicyService;
    queue: {
        add: (jobName: string, payload: Record<string, unknown>, options?: Record<string, unknown>) => Promise<{
            id: string;
        }>;
    };
    classifier: RetryErrorClassifier;
    maxAttempts: number;
    backoffMs: number;
    providerTimeoutMs?: number;
};
export declare class DocumentProcessingService {
    private readonly deps;
    constructor(deps: ProcessingDependencies);
    processDocument(documentId: string): Promise<void>;
}
