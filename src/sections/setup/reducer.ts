import { SetupKeypair } from "zokrates-js";

export type ISetupAction = {
    type: 'loading' | 'cleanup' | 'success' | 'error';
    payload?: SetupKeypair;
}

export interface ISetupState {
    isLoading: boolean,
    result: SetupKeypair,
    error: string
}

export function setupReducer(state: Partial<ISetupState>, action: ISetupAction) {
    switch (action.type) {
        case 'loading':
            return {
                ...state,
                result: '',
                error: '',
                isLoading: true,
            }
        case 'cleanup': {
            return {
                result: null,
                error: '',
                isLoading: false
            }
        }
        case 'success':
            return { 
                isLoading: false,
                result: action.payload, 
                error: '',
            }
        case 'error':
            return { 
                isLoading: false,
                error: action.payload,
                result: null,
            }
        default:
            return state;
    }
}