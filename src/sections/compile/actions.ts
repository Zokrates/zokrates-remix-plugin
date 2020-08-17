import { ICompileAction } from './reducer';

export const onLoading = (): ICompileAction => {
    return {
        type: 'loading'
    };
};

export const onSuccess = (artifacts: any): ICompileAction => {
    return {
        type: 'success',
        payload: artifacts
    };
};

export const onError = (error: any): ICompileAction => {
    return {
        type: 'error',
        payload: error.toString()
    };
};