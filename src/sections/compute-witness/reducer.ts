export type IComputeWitnessAction = {
    type: 'loading' | 'success' | 'error' | 'reset' | 'field_update';
    payload?: any;
}

export interface IComputeWitnessState {
    isLoading: boolean;
    result: string;
    error: string;
    inputFields: object;
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
        case 'reset':
            return {
                result: null,
                error: '',
                isLoading: false,
                inputFields: {}
            }
        case 'field_update': {
            return {
                ...state,
                inputFields: {
                    ...state.inputFields,
                    [action.payload.name]: 
                    {
                        raw: action.payload.raw,
                        value: action.payload.value
                    }
                }
            }
        }
        default:
            return state;
    }
}