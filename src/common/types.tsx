import { ResolverResult } from 'zokrates-js';

interface Resolver {
    resolve(location: string, path: string): Promise<ResolverResult>;
}

export { Resolver, ResolverResult };