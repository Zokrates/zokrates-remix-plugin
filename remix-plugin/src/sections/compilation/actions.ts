import { ICompilationAction } from "./reducer";

export const onLoading = (): ICompilationAction => {
    return { 
        type: 'loading' 
    };
}

export const onSuccess = (program: any): ICompilationAction => {
    return {
        type: 'success',
        payload: program
    }
}

export const onError = (error: any): ICompilationAction => {
    console.error("Error occurred while compiling: " + error);
    return {
        type: 'error',
        payload: error.toString()
    }
}