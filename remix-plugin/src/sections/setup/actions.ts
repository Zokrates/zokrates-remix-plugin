import { ISetupAction } from "./reducer";
import { SetupResult } from "../../state/types";

export const onLoading = (): ISetupAction => {
    return {
        type: 'loading'
    }
}

export const onSuccess = (setupResult: SetupResult): ISetupAction => {
    return {
        type: 'success',
        payload: setupResult
    }
}

export const onError = (error: any): ISetupAction => {
    console.error("Error occurred while running setup: " + error);
    return {
        type: 'error',
        payload: error.toString()
    }
}