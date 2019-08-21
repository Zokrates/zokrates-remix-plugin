import { Resolver } from '../common/types';

export default class RemixResolver implements Resolver {

    resolve = (location: string, path: string): Promise<string> => {
        return new Promise<string>((resolve, reject) => {
            // todo: resolve logic
        });
    }
}