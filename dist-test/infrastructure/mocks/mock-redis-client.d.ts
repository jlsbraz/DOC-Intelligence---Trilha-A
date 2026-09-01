export declare class MockRedisClient {
    private data;
    private expirations;
    get(key: string): Promise<string | null>;
    set(key: string, value: string, options?: any): Promise<void>;
    del(...keys: string[]): Promise<number>;
    expire(key: string, seconds: number): Promise<number>;
    ttl(key: string): Promise<number>;
    lpush(key: string, ...values: string[]): Promise<number>;
    rpop(key: string): Promise<string | null>;
    llen(key: string): Promise<number>;
    blpop(keys: string[], _timeout: number): Promise<[string, string] | null>;
    zadd(key: string, score: number, member: string): Promise<number>;
    zrem(key: string, ...members: string[]): Promise<number>;
    hset(key: string, field: string, value: string): Promise<number>;
    hget(key: string, field: string): Promise<string | null>;
    hgetall(key: string): Promise<Record<string, string>>;
    hdel(key: string, ...fields: string[]): Promise<number>;
    flushdb(): Promise<void>;
    quit(): Promise<void>;
    private checkExpiration;
}
export declare const createMockRedisConnection: () => MockRedisClient;
