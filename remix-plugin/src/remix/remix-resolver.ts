import { Resolver, ResolverResult } from '../common/types';
import { remixClient } from './remix-client';
import * as path_ from 'path';

export default class RemixResolver implements Resolver {

    private extension: string = '.code';
    private imports: Map<String, ResolverResult> = new Map();

    gatherImports = async (location: string, source: string) => {
        var regex = /^\s*import\s*[\'\"]([^\'\"]+)[\'\"]/;
        var match: any;
        do {
            match = regex.exec(source);
            if (match) {
                let result = await this.resolve(location, match[1]);
                this.imports.set(result.location, result);
                await this.gatherImports(result.location, result.source)
            }
        } while (match);
    }

    handleImportCalls = (path: string): ResolverResult => {
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
                let browserPath = this.getBrowserPath(_path);
                let source = await remixClient.getFile(browserPath);
                resolve({ source, location: _path } as ResolverResult);
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