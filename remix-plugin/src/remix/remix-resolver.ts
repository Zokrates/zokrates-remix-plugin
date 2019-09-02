import { Resolver, ResolverResult } from '../common/types';
import { remixClient } from './remix-client';

export default class RemixResolver implements Resolver {

    private extension: string = '.code';
    private imports: Map<String, ResolverResult> = new Map();
    private reserved: Array<string> = ['ecc/', 'signature/', 'hashes/', 'utils/'];

    gatherImports = async (location: string, source: string) => {
        var regex = /^\s*import\s*[\'\"]([^\'\"]+)[\'\"]/gm;
        var match: any;

        while (match = regex.exec(source)) {
            let path: string = match[1];
            let stdlib = this.reserved.some(r => path.startsWith(r));

            if (!stdlib) {
                let result = await this.resolve(location, path);
                this.imports.set(result.location, result);
                
                await this.gatherImports(result.location, result.source)
            }
        }
    }

    syncResolve = (location: string, path: string): ResolverResult => {
        return this.imports.get(path) || { source: '', location: path } as ResolverResult;
    }

    resolve = (location: string, path: string): Promise<ResolverResult> => {
        return new Promise<ResolverResult>(async (resolve, reject) => {
            try {
                let path_ = path.endsWith(this.extension) ? path : path.concat(this.extension);
                let source = await remixClient.getFile(path_);
                resolve({ source: source, location: path } as ResolverResult);
            } catch (error) {
                reject(error);
            }
        });
    }
}

export const remixResolver = new RemixResolver();