export type TrustPolicyConfig = {
    threshold: number;
};
export declare class TrustPolicyService {
    private readonly config;
    constructor(config: TrustPolicyConfig);
    shouldApprove(confidence: number): boolean;
}
