"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockConfig = exports.isMockEnabled = void 0;
const isMockEnabled = () => {
    const enabled = process.env.ENABLE_MOCKS;
    if (enabled === undefined) {
        return true;
    }
    return enabled === 'true' || enabled === '1' || enabled === 'yes';
};
exports.isMockEnabled = isMockEnabled;
exports.mockConfig = {
    enabled: (0, exports.isMockEnabled)(),
    redis: {
        host: process.env.REDIS_HOST ?? 'localhost',
        port: Number(process.env.REDIS_PORT ?? 6379),
    },
    database: {
        url: process.env.DATABASE_URL ?? 'mock://in-memory-database',
    },
};
//# sourceMappingURL=mock-config.js.map