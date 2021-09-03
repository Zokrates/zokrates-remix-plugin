import { CompilationArtifacts, ComputationResult } from "zokrates-js";

export type CompilationResult = {
  artifacts: CompilationArtifacts;
  source: string;
};

export { CompilationArtifacts, ComputationResult };
