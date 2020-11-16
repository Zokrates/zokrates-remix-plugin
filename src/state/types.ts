import { CompilationArtifacts, ComputationResult } from "zokrates-js";

export type CompilationResult = {
  artifacts: CompilationArtifacts;
  source: string;
};

export type ExportVerifierResult = {
  verifier: string;
  abiVersion: string;
};

export { CompilationArtifacts, ComputationResult };
