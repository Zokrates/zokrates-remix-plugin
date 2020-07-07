import { CompilationArtifacts, ComputationResult } from 'zokrates-js';

export type SetupResult = {
    vk: string,
    pk: Uint8Array
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