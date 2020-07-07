import { CompilationArtifacts, ComputationResult, VerificationKey } from 'zokrates-js';

export type SetupResult = {
    verificationKey: VerificationKey,
    provingKey: Uint8Array
}

export type CompilationResult = {
    artifacts: CompilationArtifacts,
    source: string
}

export type ExportVerifierResult = {
    verifier: string,
    abiv2: boolean
}

export { CompilationArtifacts, ComputationResult };