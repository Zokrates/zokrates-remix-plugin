import { PluginClient } from "@remixproject/plugin";
import { HighlightPosition } from "@remixproject/plugin-api";
import { createClient } from "@remixproject/plugin-webview";

import Example from "./example";

export class RemixClient extends PluginClient {

  constructor() {
    super();
    createClient(this);
  }

  getFile = async (name: string) => {
    let path = name.startsWith("./") ? name.substr(2) : name;
    return this.call(
      "fileManager",
      "getFile",
      this.getBrowserPath(path)
    );
  };

  getFolder = async () => {
    return this.call("fileManager", "getFolder", "/browser");
  };

  getCurrentFile = async () => {
    return this.call("fileManager", "getCurrentFile");
  };

  createFile = async (name: string, content: string) => {
    try {
      await this.call("fileManager", "setFile", name, content);
      await this.call("fileManager", "switchFile", name);
    } catch (err) {
      console.log(err);
    }
  };

  highlight = async (
    position: HighlightPosition,
    file: string,
    color: string
  ) => {
    await this.call(
      "editor",
      "highlight",
      position,
      this.getBrowserPath(file),
      color
    );
  };

  discardHighlight = async () => {
    await this.call("editor", "discardHighlight");
  };

  createExample = () => {
    const { name, content } = Example;
    this.createFile(name, content);
  };

  switchFile = async (file: string) => {
    await this.call(
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
