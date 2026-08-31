"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BullMQWorkerAdapter = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const document_processing_service_1 = require("../../documents/document-processing.service");
const config_1 = require("../../config");
let BullMQWorkerAdapter = class BullMQWorkerAdapter {
    processingService;
    worker = null;
    constructor(processingService) {
        this.processingService = processingService;
    }
    async onModuleInit() {
        const redisConnection = new ioredis_1.default({
            host: config_1.config.redis.host,
            port: config_1.config.redis.port,
            retryStrategy: (times) => Math.min(times * 50, 2000),
        });
        this.worker = new bullmq_1.Worker('document-processing', this.processor.bind(this), {
            connection: redisConnection,
            concurrency: config_1.config.worker.concurrency,
        });
        this.worker.on('failed', (job, err) => {
            if (job) {
                console.error(`Job ${job.id} failed: ${err.message}`);
            }
            else {
                console.error(`Job failed: ${err.message}`);
            }
        });
        this.worker.on('completed', (job) => {
            console.log(`Job ${job.id} completed`);
        });
        console.log('BullMQ worker started');
    }
    async processor(job) {
        const { documentId } = job.data;
        if (!documentId || typeof documentId !== 'string') {
            throw new Error('Invalid job payload: missing documentId');
        }
        await this.processingService.processDocument(documentId);
    }
    async onModuleDestroy() {
        if (this.worker) {
            await this.worker.close();
            console.log('BullMQ worker closed');
        }
    }
};
exports.BullMQWorkerAdapter = BullMQWorkerAdapter;
exports.BullMQWorkerAdapter = BullMQWorkerAdapter = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [document_processing_service_1.DocumentProcessingService])
], BullMQWorkerAdapter);
//# sourceMappingURL=bullmq-worker.adapter.js.map