import { ResolverResult } from 'zokrates-js';

export interface Resolver {
    resolve(location: string, path: string): Promise<ResolverResult>;
}

export type ResolverResult = ResolverResult;