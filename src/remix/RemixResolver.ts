import { Resolver, ResolverResult } from '../common/types';
import { remixClient } from './RemixClient';

export default class RemixResolver implements Resolver {

    private defaultExtension: string = '.zok';
    private imports: Map<String, ResolverResult> = new Map();
    private reserved: Array<string> = ['ecc/', 'signature/', 'hashes/', 'utils/'];

    gatherImports = async (location: string, source: string) => {
        var regex = /^\s*(?:import|from)\s*[\'\"]([^\'\"]+)[\'\"]/gm;
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

    syncResolve = (currentLocation: string, importLocation: string): ResolverResult => {
        let key: string = this.getImportPath(currentLocation, importLocation);
        return this.imports.get(key) || null;
    }

    getImportPath = (currentLocation: string, importLocation: string) => {
        if (!importLocation.endsWith(this.defaultExtension)) {
            importLocation = importLocation.concat(this.defaultExtension);
        }
        return this.getAbsolutePath(currentLocation, importLocation);
    }

    resolve = (currentLocation: string, importLocation: string): Promise<ResolverResult> => {
        return new Promise<ResolverResult>(async (resolve, reject) => {
            try {
                let location = this.getImportPath(currentLocation, importLocation);
                let source = await remixClient.getFile(location);
                resolve({ source: source, location: location } as ResolverResult);
            } catch (error) {
                reject(error);
            }
        });
    }

    getAbsolutePath = (basePath: string, relativePath: string): string => {
        var stack = basePath.split('/');
        var chunks = relativePath.split('/');
        stack.pop();
      
        for(var i = 0; i < chunks.length; i++) {
            if (chunks[i] == '.') {
                continue;
            } else if (chunks[i] == '..') {
                stack.pop();
            } else {
                stack.push(chunks[i]);
            }
        }
        return stack.join('/');
      }
}

export const remixResolver = new RemixResolver();