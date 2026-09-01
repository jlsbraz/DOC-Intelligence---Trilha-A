import { DocumentIntelligenceProvider } from './document-intelligence-provider.port';
import { AnalysisResult } from './document.types';
export type MockProviderConfig = {
    successConfidence?: number;
    failureMode?: 'retryable' | 'non_retryable';
    timeoutMs?: number;
};
export declare class MockProvider extends DocumentIntelligenceProvider {
    private readonly config;
    constructor(config?: MockProviderConfig);
    analyze(payload: {
        documentId: string;
        storagePath: string;
        contentHash: string;
        mimeType: string;
        filename: string;
    }): Promise<AnalysisResult>;
}
