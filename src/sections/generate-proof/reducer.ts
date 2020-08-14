import { Proof } from "zokrates-js"

export type IGenerateProofAction = {
    type: 'loading' | 'cleanup' | 'success' | 'error';
    payload?: Proof;
}

export interface IGenerateProofState {
    isLoading: boolean,
    result: Proof,
    error: string
}

export function generateProofReducer(state: Partial<IGenerateProofState>, action: IGenerateProofAction) {
    switch (action.type) {
        case 'loading': 
        return {
            ...state,
            isLoading: true
        }
        case 'cleanup': {
            return {
                result: null,
                error: '',
                isLoading: false,
            }
        }
        case 'success':
            return { 
                result: action.payload, 
                error: '',
                isLoading: false
            }
        case 'error':
            return { 
                error: action.payload,
                result: null,
                isLoading: false
            }
        default:
            return state;
    }
}