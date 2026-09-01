export declare class BullMqDocumentQueue {
    private readonly queue;
    constructor();
    add(jobName: string, payload: Record<string, unknown>, options?: Record<string, unknown>): Promise<import("bullmq").Job<any, any, string, import("bullmq").JobProgress>>;
}
