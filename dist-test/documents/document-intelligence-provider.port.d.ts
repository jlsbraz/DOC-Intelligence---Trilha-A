import { AnalysisResult } from './document.types';
export declare abstract class DocumentIntelligenceProvider {
    abstract analyze(payload: {
        documentId: string;
        storagePath: string;
        contentHash: string;
        mimeType: string;
        filename: string;
    }): Promise<AnalysisResult>;
}
