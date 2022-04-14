import React, { createContext, useContext, useReducer } from "react";
import { IActions, reducer } from "./reducer";
import { CompilationResult, ComputationResult } from "./types";
import { ZoKratesWebWorker } from "../zokrates/ZoKratesWebWorker";
import { SetupKeypair } from "zokrates-js";

export type Scheme = "g16" | "gm17" | "marlin";
export type Curve = "bn128" | "bls12_381" | "bls12_377" | "bw6_761";

export interface IState {
  isLoaded: boolean;
  options: { curve: Curve; scheme: Scheme };
  zokratesWebWorker: ZoKratesWebWorker;
  compilationResult: CompilationResult;
  universalSetupResult: Uint8Array;
  setupResult: SetupKeypair;
  computationResult: ComputationResult;
  generateProofResult: string;
}

const initialState = {
  isLoaded: false,
  options: {
    scheme: "g16",
    curve: "bn128",
  },
  universalSetupResult: null,
  compilationResult: null,
  setupResult: null,
  computationResult: null,
  generateProofResult: null,
} as IState;

const StateContext = createContext<Partial<IState>>(initialState);
const DispatchContext = createContext((() => {}) as React.Dispatch<IActions>);

export const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
export const useDispatchContext = () => useContext(DispatchContext);
