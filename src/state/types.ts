export type SetupResult = {
    verificationKey: string,
    provingKey: Uint8Array
}

export type CompilationArtifacts = {
    program: Uint8Array,
    abi: string
}

export type CompilationResult = {
    artifacts: CompilationArtifacts,
    source: string
}

export type ExportVerifierResult = {
    verifier: string,
    abiv2: boolean
}