import { createIframeClient, PluginClient, Api, RemixApi } from '@remixproject/plugin'
import Example from './example';

export class RemixClient {

    private client: PluginClient<any>;

    createClient = async () => {
        this.client = createIframeClient<Api, RemixApi>();
        return this.client.onload();
    }

    getFile = async (name: string) => {
        return new Promise<string>(async (resolve, reject) => {
            try {
                let content = await this.client.call('fileManager', 'getFile', name);
                resolve(content);
            } catch (error) {
                console.log(error);
                reject(`Module ${name} not found`);
            }
        });
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
}

export const remixClient = new RemixClient()