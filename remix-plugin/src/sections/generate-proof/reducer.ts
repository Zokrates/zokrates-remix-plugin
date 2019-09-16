export type IGenerateProofAction = {
    type: 'loading' | 'success' | 'error';
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