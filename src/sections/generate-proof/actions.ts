import { IGenerateProofAction } from './reducer';
import { Proof } from 'zokrates-js';

export const onLoading = (): IGenerateProofAction => {
    return {
        type: 'loading'
    };
};

export const onCleanup = (): IGenerateProofAction => {
    return {
        type: 'cleanup'
    };
};

export const onSuccess = (proof: Proof): IGenerateProofAction => {
    return {
        type: 'success',
        payload: proof
    };
};

export const onError = (error: any): IGenerateProofAction => {
    console.error('Error occurred while genereting proof: ' + error);
    return {
        type: 'error',
        payload: error.toString()
    };
};