import { IState } from './Store';

export type IActions = {
    type: 'set_loaded' | 
          'set_compile_result' | 
          'set_witness_result'

    payload?: any;
}

export const reducer = (state: IState, action: IActions) => {
    switch (action.type) {
        case 'set_loaded': 
            return { 
                ...state, 
                isLoaded: true 
            };
        case 'set_compile_result':
            return {
                ...state,
                compilationResult: action.payload
            }
        case 'set_witness_result':
            return { 
                ...state, 
                witnessResult: action.payload   
            }
        default:
            return state;
    }
}