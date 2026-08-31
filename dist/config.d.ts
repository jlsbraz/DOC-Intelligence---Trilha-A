export declare const config: {
    redis: {
        host: string;
        port: number;
    };
    database: {
        url: string;
    };
    processing: {
        maxAttempts: number;
        backoffMs: number;
        confidenceThreshold: number;
    };
    worker: {
        concurrency: number;
    };
    storage: {
        uploadDir: string;
    };
    server: {
        port: number;
        nodeEnv: string;
    };
};
