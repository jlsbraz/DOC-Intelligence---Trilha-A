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
var DocumentIngestionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentIngestionService = void 0;
const crypto_1 = require("crypto");
const common_1 = require("@nestjs/common");
const crypto_2 = require("crypto");
const document_status_enum_1 = require("./document-status.enum");
let DocumentIngestionService = DocumentIngestionService_1 = class DocumentIngestionService {
    deps;
    constructor(deps) {
        this.deps = deps;
    }
    static computeHash(buffer) {
        return (0, crypto_2.createHash)('sha256').update(buffer).digest('hex');
    }
    async ingestDocument(file) {
        const contentHash = DocumentIngestionService_1.computeHash(file.buffer);
        const existing = await this.deps.repository.findByContentHash(contentHash);
        if (existing) {
            return { id: existing.id, status: existing.status, existing: true };
        }
        const documentId = (0, crypto_1.randomUUID)();
        const saved = await this.deps.storage.save(file, documentId);
        const document = {
            id: documentId,
            contentHash,
            filename: file.originalname,
            mimeType: file.mimetype ?? 'application/octet-stream',
            storagePath: saved.path,
            status: document_status_enum_1.DocumentStatus.RECEIVED,
            attempts: 0,
            confidence: undefined,
            result: null,
            provenance: null,
            errorType: null,
            lastError: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        try {
            await this.deps.repository.create(document);
        }
        catch (error) {
            const duplicate = await this.deps.repository.findByContentHash(contentHash);
            if (duplicate) {
                return { id: duplicate.id, status: duplicate.status, existing: true };
            }
            throw error;
        }
        await this.deps.queue.add('document-processing', { documentId }, { attempts: 1 });
        return { id: documentId, status: document_status_enum_1.DocumentStatus.RECEIVED, existing: false };
    }
};
exports.DocumentIngestionService = DocumentIngestionService;
exports.DocumentIngestionService = DocumentIngestionService = DocumentIngestionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], DocumentIngestionService);
//# sourceMappingURL=document-ingestion.service.js.map