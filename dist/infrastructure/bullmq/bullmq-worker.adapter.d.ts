import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { DocumentProcessingService } from '../../documents/document-processing.service';
export declare class BullMQWorkerAdapter implements OnModuleInit, OnModuleDestroy {
    private readonly processingService;
    private worker;
    private readonly logger;
    constructor(processingService: DocumentProcessingService);
    onModuleInit(): Promise<void>;
    private processor;
    onModuleDestroy(): Promise<void>;
}
