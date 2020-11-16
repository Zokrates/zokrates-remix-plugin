import { ISetupAction } from "./reducer";
import { SetupKeypair } from "zokrates-js";

export const onLoading = (): ISetupAction => {
  return {
    type: "loading",
  };
};

export const onCleanup = (): ISetupAction => {
  return {
    type: "cleanup",
  };
};

export const onSuccess = (setupResult: SetupKeypair): ISetupAction => {
  return {
    type: "success",
    payload: setupResult,
  };
};

export const onError = (error: any): ISetupAction => {
  console.error("Error occurred while running setup: " + error);
  return {
    type: "error",
    payload: error.toString(),
  };
};
