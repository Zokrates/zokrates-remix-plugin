export type IExportVerifierAction = {
    type: 'loading' | 'cleanup' | 'update_abiv2' | 'success' | 'error';
    field?: string,
    payload?: any;
}

export interface IExportVerifierState {
    isLoading: boolean,
    abiv2: boolean,
    result: string,
    error: string
}

export function exportVerifierReducer(state: Partial<IExportVerifierState>, action: IExportVerifierAction) {
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
                ...state,
                result: '',
                error: '',
                isLoading: false,
            }
        }
        case 'update_abiv2':
            return { 
                ...state, 
                abiv2: action.payload
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
                ...state, 
                error: action.payload,
                result: null,
                isLoading: false,
            }
        default:
            return state;
    }
}