import { getAbsoluteImportPath } from './utils';
const stdlib = require('./stdlib.json');

const __reserved = ['ecc/', 'signature/', 'hashes/', 'utils/'];
var __state = {
  zokrates: {},
};

export async function initialize(callback) {
  let zokrates = await import('./pkg');
  __state.zokrates = zokrates;

  window.resolve = function (location, path) {
    return __resolve(location, path, callback);
  }
  return zokrates;
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

function resolveFromStdlib(location, path) {
  let key = getAbsoluteImportPath(location, path.replace(/['"]+/g, ''));
  if (!key.endsWith('.code')) {
    key += '.code';
  }
  return { source: stdlib[key] || '', location: key };
}

export function getStdLib() {
  return stdlib;
}

export function compile(source) {
  return Uint8Array.from(__state.zokrates.compile(source));
}

