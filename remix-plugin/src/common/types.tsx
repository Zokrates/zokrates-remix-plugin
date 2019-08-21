export interface Resolver {
    resolve(location: string, path: string): Promise<string>;
}