import { IExportVerifierAction } from "./reducer";

export const onLoading = (): IExportVerifierAction => {
  return {
    type: "loading",
  };
};

export const onCleanup = (): IExportVerifierAction => {
  return {
    type: "cleanup",
  };
};

export const onSuccess = (): IExportVerifierAction => {
  return {
    type: "success",
  };
};

export const onError = (error: any): IExportVerifierAction => {
  console.error("Error occurred while exporting verifier: " + error);
  return {
    type: "error",
    payload: error.toString(),
  };
};