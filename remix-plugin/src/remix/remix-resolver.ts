import { Resolver, ResolverResult } from '../common/types';
import { remixClient } from './remix-client';

export default class RemixResolver implements Resolver {

    private extension: string = '.code';

    resolve = (location: string, path: string): Promise<ResolverResult> => {
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