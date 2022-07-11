export type ComponentType =
  | "field"
  | "u8"
  | "u16"
  | "u32"
  | "u64"
  | "bool"
  | "array"
  | "tuple"
  | "struct";

export interface Component {
  name?: string;
  public?: boolean;
  type: ComponentType | any;
  size?: number;
  components?: Component | any;
  members?: Array<Component>;
}

export interface Abi {
  inputs: Array<Component>;
  outputs: Array<Component>;
}
