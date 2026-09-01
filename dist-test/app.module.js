"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_controller_1 = require("./app.controller");
const api_key_guard_1 = require("./api-key.guard");
const document_ingestion_service_1 = require("./documents/document-ingestion.service");
const document_processing_service_1 = require("./documents/document-processing.service");
const document_repository_port_1 = require("./documents/document-repository.port");
const retry_error_classifier_1 = require("./documents/retry-error-classifier");
const trust_policy_service_1 = require("./documents/trust-policy.service");
const document_intelligence_provider_port_1 = require("./documents/document-intelligence-provider.port");
const storage_port_1 = require("./documents/storage-port");
const mock_provider_1 = require("./documents/mock-provider");
const file_system_storage_1 = require("./documents/file-system-storage");
const prisma_postgres_repository_1 = require("./prisma/prisma-postgres.repository");
const bullmq_queue_adapter_1 = require("./infrastructure/bullmq/bullmq-queue.adapter");
const bullmq_worker_adapter_1 = require("./infrastructure/bullmq/bullmq-worker.adapter");
const mock_prisma_repository_1 = require("./infrastructure/mocks/mock-prisma-repository");
const config_1 = require("./config");
const trustPolicy = new trust_policy_service_1.TrustPolicyService({ threshold: config_1.config.processing.confidenceThreshold });
const baseProviders = [
    {
        provide: core_1.APP_GUARD,
        useClass: api_key_guard_1.ApiKeyGuard,
    },
    file_system_storage_1.FileSystemStorage,
    retry_error_classifier_1.RetryErrorClassifier,
    bullmq_queue_adapter_1.BullMQQueueAdapter,
    bullmq_worker_adapter_1.BullMQWorkerAdapter,
    {
        provide: trust_policy_service_1.TrustPolicyService,
        useValue: trustPolicy,
    },
    {
        provide: document_intelligence_provider_port_1.DocumentIntelligenceProvider,
        useFactory: () => new mock_provider_1.MockProvider({}),
    },
    {
        provide: storage_port_1.StoragePort,
        useClass: file_system_storage_1.FileSystemStorage,
    },
];
const repositoryProviders = config_1.config.mock.enabled
    ? [
        mock_prisma_repository_1.MockPrismaRepository,
        {
            provide: document_repository_port_1.DocumentRepository,
            useClass: mock_prisma_repository_1.MockPrismaRepository,
        },
    ]
    : [
        prisma_postgres_repository_1.PrismaPostgresRepository,
        {
            provide: document_repository_port_1.DocumentRepository,
            useClass: prisma_postgres_repository_1.PrismaPostgresRepository,
        },
    ];
const serviceProviders = [
    {
        provide: document_ingestion_service_1.DocumentIngestionService,
        useFactory: (repository, storage, provider, queue) => new document_ingestion_service_1.DocumentIngestionService({
            repository,
            storage,
            provider,
            queue,
        }),
        inject: [document_repository_port_1.DocumentRepository, storage_port_1.StoragePort, document_intelligence_provider_port_1.DocumentIntelligenceProvider, bullmq_queue_adapter_1.BullMQQueueAdapter],
    },
    {
        provide: document_processing_service_1.DocumentProcessingService,
        useFactory: (repository, provider, trustPolicyService, classifier, queue) => new document_processing_service_1.DocumentProcessingService({
            repository,
            provider,
            trustPolicy: trustPolicyService,
            queue,
            classifier,
            maxAttempts: config_1.config.processing.maxAttempts,
            backoffMs: config_1.config.processing.backoffMs,
            providerTimeoutMs: config_1.config.processing.providerTimeoutMs,
        }),
        inject: [document_repository_port_1.DocumentRepository, document_intelligence_provider_port_1.DocumentIntelligenceProvider, trust_policy_service_1.TrustPolicyService, retry_error_classifier_1.RetryErrorClassifier, bullmq_queue_adapter_1.BullMQQueueAdapter],
    },
];
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        controllers: [app_controller_1.AppController],
        providers: [...baseProviders, ...repositoryProviders, ...serviceProviders],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map