export type ComponentType = "field" | "u" | "bool" | "array" | "struct";

export interface Component {
    name?: string,
    public?: boolean;
    type: ComponentType,
    size?: number,
    components?: any,
    members?: Array<Component>,
}

export interface Abi {
    inputs: Array<Component>;
    outputs: Array<Component>;
}