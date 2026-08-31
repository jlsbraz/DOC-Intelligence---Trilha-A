"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrustPolicyService = void 0;
class TrustPolicyService {
    config;
    constructor(config) {
        this.config = config;
    }
    shouldApprove(confidence) {
        return confidence >= this.config.threshold;
    }
}
exports.TrustPolicyService = TrustPolicyService;
//# sourceMappingURL=trust-policy.service.js.map