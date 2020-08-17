export type IComputeAction = {
    type: 'loading' | 'success' | 'error' | 'reset' | 'field_update';
    payload?: any;
};

export interface IComputeState {
    isLoading: boolean;
    result: string;
    error: string;
    inputFields: object;
}

export function computeReducer(state: Partial<IComputeState>, action: IComputeAction) {
    switch (action.type) {
        case 'loading':
            return {
                ...state,
                result: '',
                error: '',
                isLoading: true,
            };
        case 'success':
            return {
                ...state,
                result: action.payload,
                error: '',
                isLoading: false,
            };
        case 'error':
            return {
                ...state,
                error: action.payload,
                result: null,
                isLoading: false,
            };
        case 'reset':
            return {
                result: null,
                error: '',
                isLoading: false,
                inputFields: {}
            };
        case 'field_update': {
            return {
                ...state,
                inputFields: {
                    ...state.inputFields,
                    [action.payload.name]: action.payload.value
                }
            };
        }
        default:
            return state;
    }
}