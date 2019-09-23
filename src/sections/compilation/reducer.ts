export type ICompilationAction = {
    type: 'loading' | 'success' | 'error';
    payload?: any;
}

export interface ICompilationState {
    isLoading?: boolean,
    result?: Uint8Array,
    error?: string
}

export const compilationReducer = (state: ICompilationState, action: ICompilationAction) => {
    switch (action.type) {
        case 'loading':
            return {
                result: null,
                error: '',
                isLoading: true,
            }
        case 'success':
            return { 
                ...state, 
                result: action.payload, 
                error: '',
                isLoading: false,
            }
        case 'error':
            return {
                error: action.payload,
                result: null,
                isLoading: false,
            }
        default:
            return state;
    }
}