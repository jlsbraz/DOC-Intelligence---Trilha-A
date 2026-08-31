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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const document_ingestion_service_1 = require("./documents/document-ingestion.service");
const document_repository_port_1 = require("./documents/document-repository.port");
const document_status_enum_1 = require("./documents/document-status.enum");
let AppController = class AppController {
    ingestionService;
    repository;
    constructor(ingestionService, repository) {
        this.ingestionService = ingestionService;
        this.repository = repository;
    }
    async createDocument(file, res) {
        if (!file) {
            throw new common_1.BadRequestException('File is required');
        }
        const buffer = file.buffer ?? Buffer.alloc(0);
        if (buffer.length < 4) {
            throw new common_1.BadRequestException('Invalid document content');
        }
        const header = buffer.subarray(0, 8).toString('hex');
        const isPdf = header.startsWith('255044462d46');
        const isPng = header.startsWith('89504e470d0a1a0a');
        const isJpeg = buffer.subarray(0, 2).toString('hex') === 'ffd8';
        if (!isPdf && !isPng && !isJpeg) {
            throw new common_1.BadRequestException('Unsupported file type');
        }
        const result = await this.ingestionService.ingestDocument({
            buffer,
            originalname: file.originalname,
            mimetype: file.mimetype,
        });
        res.status(result.existing ? 200 : 202);
        return {
            id: result.id,
            status: result.status,
            duplicate: result.existing,
        };
    }
    async getDocument(id) {
        const document = await this.repository.findById(id);
        if (!document) {
            return { id, status: document_status_enum_1.DocumentStatus.FAILED, result: null, confidence: null, provenance: null };
        }
        return {
            id: document.id,
            status: document.status,
            result: document.result ?? null,
            confidence: document.confidence ?? null,
            provenance: document.provenance ?? null,
        };
    }
    async listDocuments(status) {
        return this.repository.listByStatus(status);
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "createDocument", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getDocument", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "listDocuments", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)('documents'),
    __metadata("design:paramtypes", [document_ingestion_service_1.DocumentIngestionService,
        document_repository_port_1.DocumentRepository])
], AppController);
//# sourceMappingURL=app.controller.js.map