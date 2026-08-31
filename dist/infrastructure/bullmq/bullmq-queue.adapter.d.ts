export declare class BullMQQueueAdapter {
    private readonly queue;
    constructor();
    add(jobName: string, payload: Record<string, unknown>, options?: Record<string, unknown>): Promise<{
        id: string;
    }>;
    close(): Promise<void>;
}
