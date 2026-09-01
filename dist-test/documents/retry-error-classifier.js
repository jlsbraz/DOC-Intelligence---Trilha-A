"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetryErrorClassifier = void 0;
class RetryErrorClassifier {
    classify(error) {
        if (!error || typeof error !== 'object') {
            return 'non_retryable';
        }
        const anyError = error;
        const status = anyError.status ?? anyError.statusCode;
        const code = anyError.code;
        const name = anyError.name ?? '';
        const message = String(anyError.message ?? '').toLowerCase();
        if (name === 'TimeoutError' ||
            name === 'AbortError' ||
            code === 'ECONNABORTED' ||
            code === 'ETIMEDOUT' ||
            status === 408 ||
            (typeof status === 'number' && status >= 500) ||
            message.includes('timeout') ||
            message.includes('timed out') ||
            message.includes('failed to fetch') ||
            message.includes('network error') ||
            message.includes('service unavailable') ||
            message.includes('internal server error')) {
            return 'retryable';
        }
        if (status === 400 ||
            status === 422 ||
            status === 429 ||
            (typeof status === 'number' && status >= 400 && status < 500 && status !== 408)) {
            return 'non_retryable';
        }
        return 'non_retryable';
    }
}
exports.RetryErrorClassifier = RetryErrorClassifier;
//# sourceMappingURL=retry-error-classifier.js.map