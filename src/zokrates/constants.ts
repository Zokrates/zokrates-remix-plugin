export const WA_COMPILE = 'compile';
export const WA_COMPUTE = 'compute';
export const WA_SETUP = 'setup';
export const WA_EXPORT_VERIFIER = 'export-verifier';
export const WA_GENERATE_PROOF = 'generate-proof';
export const WA_ERROR = 'error';

export type ActionType = typeof WA_COMPILE |
    typeof WA_COMPUTE |
    typeof WA_SETUP |
    typeof WA_EXPORT_VERIFIER |
    typeof WA_GENERATE_PROOF;
