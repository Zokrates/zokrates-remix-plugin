import { IActions } from './reducer';

export const setCompileResult = (program: any, source: string): IActions => {
    return {
        type: 'set_compile_result', 
        payload: { 
            program, source
        }
    }
}

export const setWitnessResult = (witness: string): IActions => {
    return {
        type: 'set_witness_result', 
        payload: witness
    }
}