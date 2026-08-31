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
exports.MockProvider = void 0;
const common_1 = require("@nestjs/common");
const document_intelligence_provider_port_1 = require("./document-intelligence-provider.port");
let MockProvider = class MockProvider extends document_intelligence_provider_port_1.DocumentIntelligenceProvider {
    config;
    constructor(config = {}) {
        super();
        this.config = config;
    }
    async analyze(payload) {
        if (this.config.failureMode === 'retryable') {
            throw Object.assign(new Error('timeout while calling provider'), {
                name: 'TimeoutError',
                status: 504,
            });
        }
        if (this.config.failureMode === 'non_retryable') {
            throw Object.assign(new Error('document rejected by provider'), {
                name: 'ValidationError',
                status: 422,
            });
        }
        return {
            confidence: this.config.successConfidence ?? 0.9,
            extractedText: `Processed ${payload.filename}`,
            promptText: 'Extract the document fields',
            modelId: 'mock-model',
            temperature: 0.2,
        };
    }
};
exports.MockProvider = MockProvider;
exports.MockProvider = MockProvider = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], MockProvider);
//# sourceMappingURL=mock-provider.js.map