import { getAbsolutePath, platform } from './utils';
import stdlib from '../stdlib.json';

const __reserved = ['ecc/', 'signature/', 'hashes/', 'utils/'];
var   __state = {};

export async function initialize(callback) {
  let zokrates = await import('../pkg');
  __state.zokrates = zokrates;

  platform().resolve = function (location, path) {
    return __resolve(location, path, callback);
  }
}

function __resolve(location, path, callback) {
  let result;
  if (__reserved.some(p => location.startsWith(p) || path.startsWith(p))) {
    result = resolveFromStdlib(location, path);
  } else {
    result = callback(location, path);
  }
  return __state.zokrates.ResolverResult.new(result.source, result.location)
}

export function resolveFromStdlib(location, path) {
  let key = getAbsolutePath(location, path);
  if (!key.endsWith('.code')) {
    key += '.code';
  }
  return { source: stdlib[key] || '', location: key };
}

export function getStdLib() {
  return stdlib;
}

export function compile(source) {
  if (typeof __state.zokrates === 'undefined') {
    throw new Error("You must call initialize() before calling this method")
  }
  return Uint8Array.from(__state.zokrates.compile(source));
}