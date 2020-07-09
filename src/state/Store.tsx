import React, { createContext, useContext, useReducer } from 'react';
import { IActions, reducer } from './reducer';
import { CompilationResult, ExportVerifierResult, ComputationResult } from './types';
import { ZoKratesWebWorker } from '../zokrates/ZoKratesWebWorker';
import { ZoKratesProvider, SetupKeypair } from 'zokrates-js';

export interface IState {
    isLoaded: boolean,
    zokratesWebWorker: ZoKratesWebWorker,
    zokratesProvider: ZoKratesProvider,
    compilationResult: CompilationResult,
    setupResult: SetupKeypair,
    computationResult: ComputationResult,
    exportVerifierResult: ExportVerifierResult,
    generateProofResult: string
}

const initialState = {
    isLoaded: false,
    compilationResult: null,
    setupResult: null,
    computationResult: null,
    exportVerifierResult: null,
    generateProofResult: '',
} as IState;

const StateContext = createContext<Partial<IState>>(initialState);
const DispatchContext = createContext((() => {}) as React.Dispatch<IActions>);

export const StateProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <DispatchContext.Provider value={dispatch}>
            <StateContext.Provider value={state}>
                {children}
            </StateContext.Provider>
        </DispatchContext.Provider>
    );
}

export const useStateContext = () => useContext(StateContext);
export const useDispatchContext = () => useContext(DispatchContext);