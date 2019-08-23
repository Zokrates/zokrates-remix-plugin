import { Resolver, ResolverResult } from '../common/types';
import { remixClient } from './remix-client';
import * as path_ from 'path';

export default class RemixResolver implements Resolver {

    private extension: string = '.code';
    private imports: Map<String, any> = new Map();

    gatherImports = async (location: string, path: string) => {
        var regex = /^\s*import\s*[\'\"]([^\'\"]+)[\'\"]/g
        let result = await this.resolve(location, path);

        this.imports.set(result.location, result);
        var match;
        while ((match = regex.exec(result.source))) {
            var path = match[1];
            await this.gatherImports(result.location, path);
        }
    }

    handleImportCalls = (path: string): any => {
        return this.imports.get(path);
    }

    resolve = (location: string, path: string): Promise<ResolverResult> => {
        if (path.startsWith('ecc') || 
            path.startsWith('signature') || 
            path.startsWith('hashes') || 
            path.startsWith('utils')) {
            return this.resolveFromStdLib(path);
        }
        return this.resolveFromRemix(path);
    }

    resolveFromStdLib = (path: string): Promise<ResolverResult> => {
        return new Promise<ResolverResult>(async (resolve, reject) => {
            try {
                let relativePath = path_.join(__dirname, "public/stdlib", path);
                if (!path.endsWith(".code")) {
                    relativePath = relativePath.concat(".code");
                }

                let response = await fetch(relativePath)
                let source = await response.text();
                resolve({ source: source, location: path } as ResolverResult);
            } catch (error) {
                reject(error);
            }
        });
    }

    resolveFromRemix = (path: string): Promise<ResolverResult> => {
        return new Promise<ResolverResult>(async (resolve, reject) => {
            const _path = path.replace('./', '');
            try {
                let source = await remixClient.getFile(this.getBrowserPath(_path));
                resolve({ source, location: _path } as ResolverResult);
            } catch (error) {
                reject(error);
            }
        });
    }

    private getBrowserPath = (path: string) => {
        let browserPath = `browser/${path}`;
        if (path.endsWith(this.extension)) {
            return browserPath;
        }
        return browserPath.concat(this.extension);
    }
}

export const remixResolver = new RemixResolver();