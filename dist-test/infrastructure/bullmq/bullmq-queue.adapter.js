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
exports.BullMQQueueAdapter = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const config_1 = require("../../config");
const mock_redis_client_1 = require("../mocks/mock-redis-client");
let BullMQQueueAdapter = class BullMQQueueAdapter {
    queue;
    constructor() {
        const redisConnection = config_1.config.mock.enabled
            ? new mock_redis_client_1.MockRedisClient()
            : new ioredis_1.default({
                host: config_1.config.redis.host,
                port: config_1.config.redis.port,
                maxRetriesPerRequest: null,
                retryStrategy: (times) => Math.min(times * 50, 2000),
            });
        this.queue = new bullmq_1.Queue('document-processing', {
            connection: redisConnection,
        });
    }
    async add(jobName, payload, options) {
        const job = await this.queue.add(jobName, payload, {
            attempts: options?.attempts ?? 1,
            delay: options?.delay ?? 0,
            removeOnComplete: true,
            removeOnFail: false,
        });
        return { id: job.id ?? '' };
    }
    async close() {
        await this.queue.close();
    }
};
exports.BullMQQueueAdapter = BullMQQueueAdapter;
exports.BullMQQueueAdapter = BullMQQueueAdapter = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], BullMQQueueAdapter);
//# sourceMappingURL=bullmq-queue.adapter.js.map