export type ICompileAction = {
  type: "loading" | "success" | "error";
  payload?: any;
};

export interface ICompileState {
  isLoading?: boolean;
  result?: Uint8Array;
  error?: string;
}

export const compileReducer = (
  state: ICompileState,
  action: ICompileAction
) => {
  switch (action.type) {
    case "loading":
      return {
        result: null,
        error: "",
        isLoading: true,
      };
    case "success":
      return {
        ...state,
        result: action.payload,
        error: "",
        isLoading: false,
      };
    case "error":
      return {
        error: action.payload,
        result: null,
        isLoading: false,
      };
    default:
      return state;
  }
};
