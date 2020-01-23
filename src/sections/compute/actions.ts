import { IComputeAction } from "./reducer";

export const onLoading = (): IComputeAction => {
    return { 
        type: 'loading' 
    };
}

export const onReset = (): IComputeAction => {
    return { 
        type: 'reset'
    };
}

export const onSuccess = (result: any): IComputeAction => {
    return {
        type: 'success',
        payload: result
    }
}

export const onError = (error: any): IComputeAction => {
    return {
        type: 'error',
        payload: error.toString()
    }
}

export const onFieldUpdate = (name: string, raw: string, value: any): IComputeAction => {
    return {
        type: 'field_update',
        payload: { name, raw, value }
    }
}