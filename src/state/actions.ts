import { IActions } from "./reducer";
import { ZoKratesWebWorker } from "../zokrates/ZoKratesWebWorker";
import {
  SetupKeypair,
  Proof,
  CompilationArtifacts,
  ComputationResult,
} from "zokrates-js";

export const onLoaded = (worker: ZoKratesWebWorker): IActions => {
  return {
    type: "set_loaded",
    payload: worker,
  };
};

export const setScheme = (scheme: string): IActions => {
  return {
    type: "set_scheme",
    payload: scheme,
  };
};

export const setCompilationResult = (
  artifacts: CompilationArtifacts,
  source: string
): IActions => {
  return {
    type: "set_compilation_result",
    payload: {
      artifacts,
      source,
    },
  };
};

export const setComputationResult = (result: ComputationResult): IActions => {
  return {
    type: "set_computation_result",
    payload: result,
  };
};

export const setSetupResult = (keypair: SetupKeypair): IActions => {
  return {
    type: "set_setup_result",
    payload: keypair,
  };
};

export const setUniversalSetupResult = (srs: Uint8Array): IActions => {
  return {
    type: "set_universal_setup_result",
    payload: srs,
  };
};

export const setGenerateProofResult = (proof: Proof): IActions => {
  return {
    type: "set_generate_proof_result",
    payload: proof,
  };
};
