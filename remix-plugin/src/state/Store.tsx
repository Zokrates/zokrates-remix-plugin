import React, { createContext, useContext, useReducer } from 'react';
import { IActions, reducer } from './reducer';

export interface IState {
    isLoaded: boolean,
    compilationResult: {
        program: Uint8Array,
        source: string
    },
    witnessResult: string,
}

const initialState = {
    isLoaded: false,
    compilationResult: null,
    witnessResult: '',
};

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