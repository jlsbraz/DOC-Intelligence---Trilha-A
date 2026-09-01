export declare const isMockEnabled: () => boolean;
export declare const mockConfig: {
    enabled: boolean;
    redis: {
        host: string;
        port: number;
    };
    database: {
        url: string;
    };
};
