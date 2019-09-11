export type IExportVerifierAction = {
    type: 'generating' | 'field' | 'success' | 'error';
    field?: string,
    payload?: any;
}

export interface IExportVerifierState {
    isGenerating: boolean,
    fields: any,
    result: string,
    error: string
}

export function exportVerifierReducer(state: Partial<IExportVerifierState>, action: IExportVerifierAction) {
    switch (action.type) {
        case 'generating':
            return {
                ...state,
                isGenerating: true,
            }
        case 'field':
            return { 
                ...state, 
                fields: {
                    ...state.fields,
                    [action.field]: action.payload,
                }
            }
        case 'success':
            return { 
                ...state, 
                result: action.payload, 
                error: '',
                isGenerating: false,
            }
        case 'error':
            return { 
                ...state, 
                error: action.payload,
                result: null,
                isGenerating: false,
            }
        default:
            return state;
    }
}