export type RetryableErrorKind = 'retryable' | 'non_retryable';
export declare class RetryErrorClassifier {
    classify(error: unknown): RetryableErrorKind;
}
