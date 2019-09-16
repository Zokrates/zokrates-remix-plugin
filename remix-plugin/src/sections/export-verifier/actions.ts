import { IExportVerifierAction } from "./reducer";

export const onLoading = (): IExportVerifierAction => {
    return { 
        type: 'loading' 
    };
}

export const onSuccess = (verifierCode: string): IExportVerifierAction => {
    return {
        type: 'success',
        payload: verifierCode
    }
}

export const onError = (error: any): IExportVerifierAction => {
    console.error("Error occurred while exporting verifier: " + error);
    return {
        type: 'error',
        payload: error.toString()
    }
}

export const updateAbi = (value: boolean): IExportVerifierAction => {
    return {
        type: 'update_abiv2',
        payload: value, 
    }
}