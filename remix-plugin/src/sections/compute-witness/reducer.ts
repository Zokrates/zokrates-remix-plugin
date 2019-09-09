export type IComputeWitnessAction = {
    type: 'computing' | 'field' | 'success' | 'error' | 'cleanup';
    field?: string,
    payload?: any;
}

export interface IComputeWitnessState {
    isComputing: boolean,
    fields: object,
    result: string,
    error: string
}

export function witnessReducer(state: Partial<IComputeWitnessState>, action: IComputeWitnessAction) {
    switch (action.type) {
        case 'computing':
            return {
                ...state,
                isComputing: true,
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
                isComputing: false,
            }
        case 'error':
            return { 
                ...state, 
                error: action.payload,
                result: null,
                isComputing: false,
            }
        case 'cleanup':
            return {
                fields: {},
                result: null,
                error: '',
                isComputing: false,
            }
        default:
            return state;
    }
}