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
        return this.imports.get(path);
    }

    resolve = (location: string, path: string): Promise<ResolverResult> => {
        return new Promise<ResolverResult>(async (resolve, reject) => {
            console.log(`Resolving '${path}' from remix`);
            const _path = path.replace('./', '');
            try {
                let browserPath = this.getBrowserPath(_path);
                let source = await remixClient.getFile(browserPath);
                resolve({ source: source, location: _path } as ResolverResult);
            } catch (error) {
                reject(error);
            }
        });
    }

    private getBrowserPath = (path: string) => {
        if (path.startsWith('browser/')) {
            return path;
        }
        let browserPath = `browser/${path}`;
        if (path.endsWith(this.extension)) {
            return browserPath;
        }
        return browserPath.concat(this.extension);
    }
}

export const remixResolver = new RemixResolver();