import { IExportVerifierAction } from "./reducer";

export const onGenerating = (): IExportVerifierAction => {
    return { 
        type: 'generating' 
    };
}

export const onSuccess = (verifierCode: string): IExportVerifierAction => {
    return {
        type: 'success',
        payload: verifierCode
    }
}

export const onError = (error: any): IExportVerifierAction => {
    console.log(error);
    return {
        type: 'error',
        payload: error.toString()
    }
}

export const onFieldChange = (field: string, value: any): IExportVerifierAction => {
    return {
        type: 'field',
        field: field, 
        payload: value, 
    }
}