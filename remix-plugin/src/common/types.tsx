export interface ResolverResult {
    source: string,
    location: string
}

export interface Resolver {
    resolve(location: string, path: string): Promise<ResolverResult>;
}