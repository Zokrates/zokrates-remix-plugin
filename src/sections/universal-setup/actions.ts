import { IUniversalSetupAction } from "./reducer";

export const onLoading = (): IUniversalSetupAction => {
  return {
    type: "loading",
  };
};

export const onSuccess = (srs: Uint8Array): IUniversalSetupAction => {
  return {
    type: "success",
    payload: srs,
  };
};

export const onError = (error: any): IUniversalSetupAction => {
  console.error("Error occurred while running universal setup: " + error);
  return {
    type: "error",
    payload: error.toString(),
  };
};
