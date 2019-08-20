import { createIframeClient } from '@remixproject/plugin'

export class RemixClient {

    client = createIframeClient()
    
    onload = this.client.onload;
}

export const remixClient = new RemixClient()