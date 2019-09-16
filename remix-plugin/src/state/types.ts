export type SetupResult = {
    verificationKey: string,
    provingKey: Uint8Array
}

export type CompilationResult = {
    program: Uint8Array,
    source: string
}