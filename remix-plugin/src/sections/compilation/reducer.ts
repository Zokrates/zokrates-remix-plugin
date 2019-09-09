export type ICompilationAction = {
    type: 'compiling' | 'success' | 'error';
    payload?: any;
}

export interface ICompilationState {
    isCompiling?: boolean,
    result?: Uint8Array,
    error?: string
}

export const compilationReducer = (state: ICompilationState, action: ICompilationAction) => {
    switch (action.type) {
        case 'compiling':
            return {
                result: null,
                error: '',
                isCompiling: true,
            }
        case 'success':
            return { 
                ...state, 
                result: action.payload, 
                error: '',
                isCompiling: false,
            }
        case 'error':
            return {
                error: action.payload,
                result: null,
                isCompiling: false,
            }
        default:
            return state;
    }
}