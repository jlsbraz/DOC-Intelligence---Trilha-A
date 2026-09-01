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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BullMqDocumentQueue = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("bullmq");
let BullMqDocumentQueue = class BullMqDocumentQueue {
    queue;
    constructor() {
        this.queue = new bullmq_1.Queue('document-processing', {
            connection: {
                host: process.env.REDIS_HOST ?? 'localhost',
                port: Number(process.env.REDIS_PORT ?? 6379),
            },
        });
    }
    async add(jobName, payload, options) {
        return this.queue.add(jobName, payload, {
            attempts: Number(options?.attempts ?? 1),
            delay: Number(options?.delay ?? 0),
            removeOnComplete: true,
            removeOnFail: true,
        });
    }
};
exports.BullMqDocumentQueue = BullMqDocumentQueue;
exports.BullMqDocumentQueue = BullMqDocumentQueue = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], BullMqDocumentQueue);
//# sourceMappingURL=bullmq-document-queue.js.map