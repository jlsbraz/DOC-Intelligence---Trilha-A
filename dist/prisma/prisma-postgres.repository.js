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
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_1 = require("@prisma/client");
const document_repository_port_1 = require("../documents/document-repository.port");
const config_1 = require("../config");
let PrismaPostgresRepository = class PrismaPostgresRepository extends document_repository_port_1.DocumentRepository {
    prisma;
    constructor() {
        super();
        this.prisma = new client_1.PrismaClient({ adapter: new adapter_pg_1.PrismaPg(config_1.config.database.url) });
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
                result: (document.result ?? client_1.Prisma.JsonNull),
                provenance: document.provenance ?? client_1.Prisma.JsonNull,
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
                result: (changes.result ?? client_1.Prisma.JsonNull),
                provenance: changes.provenance ?? client_1.Prisma.JsonNull,
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