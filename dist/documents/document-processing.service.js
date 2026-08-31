"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentProcessingService = void 0;
const common_1 = require("@nestjs/common");
const document_status_enum_1 = require("./document-status.enum");
let DocumentProcessingService = class DocumentProcessingService {
    deps;
    constructor(deps) {
        this.deps = deps;
    }
    async processDocument(documentId) {
        const document = await this.deps.repository.findById(documentId);
        if (!document) {
            return;
        }
        if (document.status === document_status_enum_1.DocumentStatus.DONE || document.status === document_status_enum_1.DocumentStatus.PENDING_REVIEW || document.status === document_status_enum_1.DocumentStatus.FAILED) {
            return;
        }
        await this.deps.repository.update(documentId, { status: document_status_enum_1.DocumentStatus.PROCESSING, updatedAt: new Date() });
        try {
            const result = await this.deps.provider.analyze({
                documentId,
                storagePath: document.storagePath,
                contentHash: document.contentHash,
                mimeType: document.mimeType,
                filename: document.filename,
            });
            const shouldApprove = this.deps.trustPolicy.shouldApprove(result.confidence);
            const updated = {
                confidence: result.confidence,
                result: { ...result },
                provenance: { promptText: result.promptText, modelId: result.modelId, temperature: result.temperature },
                status: shouldApprove ? document_status_enum_1.DocumentStatus.DONE : document_status_enum_1.DocumentStatus.PENDING_REVIEW,
                updatedAt: new Date(),
            };
            if (!shouldApprove) {
                updated.errorType = null;
                updated.lastError = null;
            }
            await this.deps.repository.update(documentId, updated);
        }
        catch (error) {
            const kind = this.deps.classifier.classify(error);
            const nextAttempt = document.attempts + 1;
            const retryable = kind === 'retryable';
            const shouldRetry = retryable && nextAttempt < this.deps.maxAttempts;
            if (shouldRetry) {
                const retryDelay = this.deps.backoffMs * Math.pow(2, nextAttempt - 1);
                await this.deps.repository.update(documentId, {
                    attempts: nextAttempt,
                    lastError: error instanceof Error ? error.message : 'Retryable processing error',
                    errorType: 'retryable',
                    status: document_status_enum_1.DocumentStatus.QUEUED,
                    updatedAt: new Date(),
                });
                await this.deps.queue.add('document-processing', { documentId }, { delay: retryDelay, attempts: 1 });
                return;
            }
            await this.deps.repository.update(documentId, {
                attempts: nextAttempt,
                lastError: error instanceof Error ? error.message : 'Processing error',
                errorType: kind,
                status: document_status_enum_1.DocumentStatus.PENDING_REVIEW,
                updatedAt: new Date(),
            });
        }
    }
};
exports.DocumentProcessingService = DocumentProcessingService;
exports.DocumentProcessingService = DocumentProcessingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], DocumentProcessingService);
//# sourceMappingURL=document-processing.service.js.map