"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockRedisConnection = exports.MockRedisClient = void 0;
class MockRedisClient {
    data = new Map();
    expirations = new Map();
    async get(key) {
        this.checkExpiration(key);
        return this.data.get(key) ?? null;
    }
    async set(key, value, options) {
        this.data.set(key, value);
        if (options?.EX) {
            const expiresAt = Date.now() + options.EX * 1000;
            this.expirations.set(key, expiresAt);
        }
    }
    async del(...keys) {
        let deleted = 0;
        for (const key of keys) {
            if (this.data.has(key)) {
                this.data.delete(key);
                this.expirations.delete(key);
                deleted++;
            }
        }
        return deleted;
    }
    async expire(key, seconds) {
        if (!this.data.has(key)) {
            return 0;
        }
        const expiresAt = Date.now() + seconds * 1000;
        this.expirations.set(key, expiresAt);
        return 1;
    }
    async ttl(key) {
        this.checkExpiration(key);
        if (!this.data.has(key)) {
            return -2;
        }
        const expiresAt = this.expirations.get(key);
        if (!expiresAt) {
            return -1;
        }
        return Math.ceil((expiresAt - Date.now()) / 1000);
    }
    async lpush(key, ...values) {
        const current = (this.data.get(key) || '[]');
        const list = typeof current === 'string' ? JSON.parse(current) : [];
        list.unshift(...values);
        this.data.set(key, JSON.stringify(list));
        return list.length;
    }
    async rpop(key) {
        const current = (this.data.get(key) || '[]');
        const list = typeof current === 'string' ? JSON.parse(current) : [];
        if (list.length === 0) {
            return null;
        }
        const value = list.pop();
        this.data.set(key, JSON.stringify(list));
        return value;
    }
    async llen(key) {
        const current = (this.data.get(key) || '[]');
        const list = typeof current === 'string' ? JSON.parse(current) : [];
        return list.length;
    }
    async blpop(keys, _timeout) {
        for (const key of keys) {
            const value = await this.rpop(key);
            if (value) {
                return [key, value];
            }
        }
        return null;
    }
    async zadd(key, score, member) {
        const current = (this.data.get(key) || '[]');
        const set = typeof current === 'string' ? JSON.parse(current) : [];
        set.push({ score, member });
        this.data.set(key, JSON.stringify(set));
        return 1;
    }
    async zrem(key, ...members) {
        const current = (this.data.get(key) || '[]');
        const set = typeof current === 'string' ? JSON.parse(current) : [];
        const before = set.length;
        const filtered = set.filter((item) => !members.includes(item.member));
        this.data.set(key, JSON.stringify(filtered));
        return before - filtered.length;
    }
    async hset(key, field, value) {
        const current = (this.data.get(key) || '{}');
        const hash = typeof current === 'string' ? JSON.parse(current) : {};
        hash[field] = value;
        this.data.set(key, JSON.stringify(hash));
        return 1;
    }
    async hget(key, field) {
        const current = (this.data.get(key) || '{}');
        const hash = typeof current === 'string' ? JSON.parse(current) : {};
        return hash[field] ?? null;
    }
    async hgetall(key) {
        const current = (this.data.get(key) || '{}');
        return typeof current === 'string' ? JSON.parse(current) : {};
    }
    async hdel(key, ...fields) {
        const current = (this.data.get(key) || '{}');
        const hash = typeof current === 'string' ? JSON.parse(current) : {};
        let deleted = 0;
        for (const field of fields) {
            if (field in hash) {
                delete hash[field];
                deleted++;
            }
        }
        this.data.set(key, JSON.stringify(hash));
        return deleted;
    }
    async flushdb() {
        this.data.clear();
        this.expirations.clear();
    }
    async quit() {
        this.data.clear();
        this.expirations.clear();
    }
    checkExpiration(key) {
        const expiresAt = this.expirations.get(key);
        if (expiresAt && Date.now() > expiresAt) {
            this.data.delete(key);
            this.expirations.delete(key);
        }
    }
}
exports.MockRedisClient = MockRedisClient;
const createMockRedisConnection = () => {
    return new MockRedisClient();
};
exports.createMockRedisConnection = createMockRedisConnection;
//# sourceMappingURL=mock-redis-client.js.map