export type IComputeWitnessAction = {
    type: 'loading' | 'field' | 'success' | 'error' | 'cleanup';
    field?: string,
    payload?: any;
}

export interface IComputeWitnessState {
    isLoading: boolean,
    fields: object,
    result: string,
    error: string
}

export function witnessReducer(state: Partial<IComputeWitnessState>, action: IComputeWitnessAction) {
    switch (action.type) {
        case 'loading':
            return {
                ...state,
                result: '',
                error: '',
                isLoading: true,
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
                isLoading: false,
            }
        case 'error':
            return { 
                ...state, 
                error: action.payload,
                result: null,
                isLoading: false,
            }
        case 'cleanup':
            return {
                fields: {},
                result: null,
                error: '',
                isLoading: false,
            }
        default:
            return state;
    }
}