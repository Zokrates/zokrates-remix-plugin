export type IUniversalSetupAction = {
  type: "loading" | "success" | "error";
  payload?: Uint8Array;
};

export interface IUniversalSetupState {
  isLoading: boolean;
  result: Uint8Array;
  error: string;
}

export function universalSetupReducer(
  state: Partial<IUniversalSetupState>,
  action: IUniversalSetupAction
) {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        result: null,
        error: "",
        isLoading: true,
      };
    case "success":
      return {
        isLoading: false,
        result: action.payload,
        error: "",
      };
    case "error":
      return {
        isLoading: false,
        error: action.payload,
        result: null,
      };
    default:
      return state;
  }
}
