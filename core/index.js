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
  if (__reserved.some(p => path.startsWith(p))) {
    let _path = !path.endsWith('.code') ? path.concat('.code') : path;
    result = { 
      source: stdlib[_path.replace(/['"]+/g, '')],
      location: path
    };
  } else {
    result = callback(location, path);
  }
  return __state.zokrates.ResolverResult.new(result.source, result.location)
}

export function getStdLib() {
  return stdlib;
}

export function compile(source) {
  return __state.zokrates.compile(source);
}