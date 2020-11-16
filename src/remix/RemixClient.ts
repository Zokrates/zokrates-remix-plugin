import {
  Api,
  createIframeClient,
  HighlightPosition,
  PluginClient,
  RemixApi,
} from "@remixproject/plugin";
import Example from "./example";

export class RemixClient {
  private client: PluginClient<any> = createIframeClient<Api, RemixApi>();

  createClient = () => {
    return this.client.onload();
  };

  getFile = async (name: string) => {
    let path = name.startsWith("./") ? name.substr(2) : name;
    return this.client.call(
      "fileManager",
      "getFile",
      this.getBrowserPath(path)
    );
  };

  getFolder = async () => {
    return this.client.call("fileManager", "getFolder", "/browser");
  };

  getCurrentFile = async () => {
    return this.client.call("fileManager", "getCurrentFile");
  };

  createFile = async (name: string, content: string) => {
    try {
      await this.client.call("fileManager", "setFile", name, content);
      await this.client.call("fileManager", "switchFile", name);
    } catch (err) {
      console.log(err);
    }
  };

  highlight = async (
    position: HighlightPosition,
    file: string,
    color: string
  ) => {
    await this.client.call(
      "editor",
      "highlight",
      position,
      this.getBrowserPath(file),
      color
    );
  };

  discardHighlight = async () => {
    await this.client.call("editor", "discardHighlight");
  };

  createExample = () => {
    const { name, content } = Example;
    this.createFile(name, content);
  };

  switchFile = async (file: string) => {
    await this.client.call(
      "fileManager",
      "switchFile",
      this.getBrowserPath(file)
    );
  };

  private getBrowserPath = (path: string) => {
    if (path.startsWith("browser/")) {
      return path;
    }
    return `browser/${path}`;
  };
}

export const remixClient = new RemixClient();
