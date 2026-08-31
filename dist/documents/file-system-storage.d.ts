import { StoragePort } from './storage-port';
export declare class FileSystemStorage extends StoragePort {
    save(input: {
        buffer: Buffer;
        originalname: string;
        mimetype?: string;
    }, documentId: string): Promise<{
        path: string;
    }>;
    read(path: string): Promise<Buffer>;
}
