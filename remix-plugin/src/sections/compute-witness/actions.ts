import { IComputeWitnessAction } from "./reducer";

export const onComputing = (): IComputeWitnessAction => {
    return { 
        type: 'computing' 
    };
}

export const onCleanup = (): IComputeWitnessAction => {
    return { 
        type: 'cleanup' 
    };
}

export const onSuccess = (witness: string): IComputeWitnessAction => {
    return {
        type: 'success',
        payload: witness
    }
}

export const onError = (error: any): IComputeWitnessAction => {
    console.log(error);
    return {
        type: 'error',
        payload: error.toString()
    }
}

export const onFieldChange = (field: string, value: string): IComputeWitnessAction => {
    return {
        type: 'field',
        field: field, 
        payload: value, 
    }
}