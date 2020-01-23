export type ComponentType = "field" | "bool" | "array" | "struct";

export interface Component {
    name?: string,
    public?: boolean;
    type: ComponentType,
    size?: number,
    components?: Component | Array<Component>;
}

export interface Abi {
    inputs: Array<Component>;
    outputs: Array<Component>;
}