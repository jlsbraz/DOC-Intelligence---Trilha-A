"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockPrismaRepository = exports.MockPrismaRepository = void 0;
class MockPrismaRepository {
    documents = new Map();
    async findById(id) {
        return this.documents.get(id) || null;
    }
    async findByContentHash(contentHash) {
        for (const doc of this.documents.values()) {
            if (doc.contentHash === contentHash) {
                return doc;
            }
        }
        return null;
    }
    async create(data) {
        const now = new Date();
        const document = {
            id: data.id,
            filename: data.filename,
            contentHash: data.contentHash,
            mimeType: data.mimeType,
            storagePath: data.storagePath ?? `storage/${data.id}`,
            status: data.status,
            attempts: data.attempts ?? 0,
            result: data.result ?? null,
            confidence: data.confidence ?? null,
            provenance: data.provenance ?? null,
            errorType: data.errorType ?? null,
            lastError: data.lastError ?? null,
            createdAt: now,
            updatedAt: now,
        };
        this.documents.set(data.id, document);
        return document;
    }
    async updateStatus(id, status, result, confidence, provenance) {
        const doc = this.documents.get(id);
        if (!doc) {
            return null;
        }
        const updated = {
            ...doc,
            status,
            result: result ?? doc.result,
            confidence: confidence ?? doc.confidence,
            provenance: provenance ?? doc.provenance,
            updatedAt: new Date(),
        };
        this.documents.set(id, updated);
        return updated;
    }
    async findByStatus(status) {
        return Array.from(this.documents.values()).filter((doc) => doc.status === status);
    }
    async deleteMany(where) {
        if (where.contentHash) {
            let deleted = 0;
            for (const [id, doc] of this.documents.entries()) {
                if (doc.contentHash === where.contentHash) {
                    this.documents.delete(id);
                    deleted++;
                }
            }
            return { count: deleted };
        }
        return { count: 0 };
    }
    async clear() {
        this.documents.clear();
    }
    async count() {
        return this.documents.size;
    }
    getAll() {
        return Array.from(this.documents.values());
    }
}
exports.MockPrismaRepository = MockPrismaRepository;
const createMockPrismaRepository = () => {
    return new MockPrismaRepository();
};
exports.createMockPrismaRepository = createMockPrismaRepository;
//# sourceMappingURL=mock-prisma-repository.js.map