import { IState } from "./Store";

export type IActions = {
  type:
    | "set_loaded"
    | "set_compilation_result"
    | "set_computation_result"
    | "set_setup_result"
    | "set_export_verifier_result"
    | "set_generate_proof_result";

  payload?: any;
};

export const reducer = (state: IState, action: IActions) => {
  switch (action.type) {
    case "set_loaded":
      return {
        ...state,
        isLoaded: true,
        zokratesWebWorker: action.payload,
      };
    case "set_compilation_result":
      return {
        ...state,
        compilationResult: action.payload,
      };
    case "set_computation_result":
      return {
        ...state,
        computationResult: action.payload,
      };
    case "set_setup_result":
      return {
        ...state,
        setupResult: action.payload,
      };
    case "set_export_verifier_result":
      return {
        ...state,
        exportVerifierResult: action.payload,
      };
    case "set_generate_proof_result":
      return {
        ...state,
        generateProofResult: action.payload,
      };
    default:
      return state;
  }
};
