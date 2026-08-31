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
exports.PrismaPostgresRepository = void 0;
const common_1 = require("@nestjs/common");
const document_repository_port_1 = require("../documents/document-repository.port");
let PrismaPostgresRepository = class PrismaPostgresRepository extends document_repository_port_1.DocumentRepository {
    prisma;
    constructor() {
        super();
        try {
            const { PrismaClient: PC } = require('@prisma/client');
            this.prisma = new PC();
        }
        catch (err) {
            console.warn('Prisma not available (expected in test environment)');
            this.prisma = null;
        }
    }
    async create(document) {
        const created = await this.prisma.document.create({
            data: {
                id: document.id,
                contentHash: document.contentHash,
                filename: document.filename,
                mimeType: document.mimeType,
                storagePath: document.storagePath,
                status: document.status,
                attempts: document.attempts,
                confidence: document.confidence ?? null,
                result: document.result ?? null,
                provenance: document.provenance ?? null,
                errorType: document.errorType ?? null,
                lastError: document.lastError ?? null,
                createdAt: document.createdAt ?? new Date(),
                updatedAt: document.updatedAt ?? new Date(),
            },
        });
        return this.mapEntity(created);
    }
    async findById(id) {
        const found = await this.prisma.document.findUnique({ where: { id } });
        return found ? this.mapEntity(found) : null;
    }
    async findByContentHash(contentHash) {
        const found = await this.prisma.document.findUnique({ where: { contentHash } });
        return found ? this.mapEntity(found) : null;
    }
    async update(id, changes) {
        const updated = await this.prisma.document.update({
            where: { id },
            data: {
                status: changes.status,
                attempts: changes.attempts,
                confidence: changes.confidence ?? null,
                result: changes.result ?? null,
                provenance: changes.provenance ?? null,
                errorType: changes.errorType ?? null,
                lastError: changes.lastError ?? null,
                updatedAt: changes.updatedAt ?? new Date(),
            },
        });
        return this.mapEntity(updated);
    }
    async listByStatus(status) {
        const list = await this.prisma.document.findMany({
            where: status ? { status } : undefined,
            orderBy: { createdAt: 'desc' },
        });
        return list.map((item) => this.mapEntity(item));
    }
    mapEntity(entity) {
        return {
            id: entity.id,
            contentHash: entity.contentHash,
            filename: entity.filename,
            mimeType: entity.mimeType,
            storagePath: entity.storagePath,
            status: entity.status,
            attempts: entity.attempts,
            confidence: entity.confidence ?? undefined,
            result: entity.result ?? null,
            provenance: entity.provenance ?? null,
            errorType: entity.errorType ?? null,
            lastError: entity.lastError ?? null,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
};
exports.PrismaPostgresRepository = PrismaPostgresRepository;
exports.PrismaPostgresRepository = PrismaPostgresRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrismaPostgresRepository);
//# sourceMappingURL=prisma-postgres.repository.js.map