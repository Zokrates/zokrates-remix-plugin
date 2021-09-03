export type IExportVerifierAction = {
  type: "loading" | "cleanup" | "success" | "error";
  field?: string;
  payload?: any;
};

export interface IExportVerifierState {
  isLoading: boolean;
  exported: boolean;
  error: string;
}

export function exportVerifierReducer(
  state: Partial<IExportVerifierState>,
  action: IExportVerifierAction
) {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        exported: false,
        error: "",
        isLoading: true,
      };
    case "cleanup": {
      return {
        ...state,
        exported: false,
        error: "",
        isLoading: false,
      };
    }
    case "success":
      return {
        ...state,
        exported: true,
        error: "",
        isLoading: false,
      };
    case "error":
      return {
        ...state,
        exported: false,
        error: action.payload,
        isLoading: false,
      };
    default:
      return state;
  }
}
