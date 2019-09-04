export interface ResolverResult {
  source: string,
  location: string
}

export function initialize(callback: (location: string, path: string) => ResolverResult): Promise<any>;
export function compile(source: string): Uint8Array;
export function getStdLib(): object;
