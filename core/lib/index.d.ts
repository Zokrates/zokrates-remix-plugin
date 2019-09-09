export interface ResolverResult {
  source: string,
  location: string
}

<<<<<<< HEAD:core/lib/index.d.ts
export function initialize(callback: (location: string, path: string) => ResolverResult): Promise<void>;
export function compile(source: string): Uint8Array;
export function getStdLib(): object;
=======
export function initialize(callback: (location: string, path: string) => ResolverResult): Promise<any>;
export function compile(source: string): Uint8Array;
export function getStdLib(): object;
>>>>>>> 0c5a114db61bafc8a680c52d98653443fc85237c:core/index.d.ts
