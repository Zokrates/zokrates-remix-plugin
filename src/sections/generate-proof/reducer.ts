export type IGenerateProofAction = {
    type: 'loading' | 'cleanup' | 'success' | 'error';
    payload?: string;
}

export interface IGenerateProofState {
    isLoading: boolean,
    result: string,
    error: string
}

export function generateProofReducer(state: Partial<IGenerateProofState>, action: IGenerateProofAction) {
    switch (action.type) {
        case 'loading': 
        return {
            ...state,
            result: '',
            error: '',
            isLoading: true
        }
        case 'cleanup': {
            return {
                result: '',
                error: '',
                isLoading: false,
            }
        }
        case 'success':
            return { 
                result: action.payload, 
                error: '',
            }
        case 'error':
            return { 
                error: action.payload,
                result: '',
            }
        default:
            return state;
    }
}