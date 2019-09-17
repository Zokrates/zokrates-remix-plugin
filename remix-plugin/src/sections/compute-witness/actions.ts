import { IComputeWitnessAction } from "./reducer";

export const onLoading = (): IComputeWitnessAction => {
    return { 
        type: 'loading' 
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
    console.error("Error occurred while computing witness: " + error);
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