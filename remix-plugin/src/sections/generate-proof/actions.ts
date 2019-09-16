import { IGenerateProofAction } from './reducer';

export const onLoading = (): IGenerateProofAction => {
    return { 
        type: 'loading' 
    };
}

export const onSuccess = (proof: string): IGenerateProofAction => {
    return {
        type: 'success',
        payload: proof
    }
}

export const onError = (error: any): IGenerateProofAction => {
    console.error("Error occurred while genereting proof: " + error);
    return {
        type: 'error',
        payload: error.toString()
    }
}