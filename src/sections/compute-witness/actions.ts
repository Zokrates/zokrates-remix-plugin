import { IComputeWitnessAction } from "./reducer";

export const onLoading = (): IComputeWitnessAction => {
    return { 
        type: 'loading' 
    };
}

export const onReset = (): IComputeWitnessAction => {
    return { 
        type: 'reset'
    };
}

export const onSuccess = (witness: string): IComputeWitnessAction => {
    return {
        type: 'success',
        payload: witness
    }
}

export const onError = (error: any): IComputeWitnessAction => {
    return {
        type: 'error',
        payload: error.toString()
    }
}

export const onFieldUpdate = (name: string, raw: string, value: any): IComputeWitnessAction => {
    return {
        type: 'field_update',
        payload: { name, raw, value }
    }
}