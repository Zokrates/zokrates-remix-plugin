import { createIframeClient, PluginClient, Api, RemixApi } from '@remixproject/plugin'
import Example from './example';

export class RemixClient {

    private client: PluginClient<any> = createIframeClient<Api, RemixApi>();

    createClient = () => {
        return this.client.onload();
    }

    getFile = async (name: string) => {
        return new Promise<string>(async (resolve, reject) => {
            let path = name.startsWith('./') ? name.substr(2) : name;
            let content = await this.client.call('fileManager', 'getFile', this.getBrowserPath(path));
            if (content) {
                resolve(content);
            } else {
                reject(`Could not find "${name}"`)
            }
        });
    }

    getFolder = async() => {
        return this.client.call('fileManager', 'getFolder', '/browser');
    }

    getCurrentFile = async () => {
        return this.client.call('fileManager', 'getCurrentFile');
    }

    createFile = async (name: string, content: string) => {
        try {
            await this.client.call('fileManager', 'setFile', name, content)
            await this.client.call('fileManager', 'switchFile', name)
        } catch (err) {
            console.log(err)
        }
    }

    createExample = () => {
        const { name, content } = Example;
        this.createFile(name, content);
    }

    private getBrowserPath = (path: string) => {
        if (path.startsWith('browser/')) {
            return path;
        }
        return `browser/${path}`;
    }
}

export const remixClient = new RemixClient()