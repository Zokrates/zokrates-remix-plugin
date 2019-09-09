/*!
 * zokrates.js
 * Copyright(c) 2019 Darko Macesic, Edi Sinovcic
 */

'use strict';

<<<<<<< HEAD
export * from "./lib";
=======
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
      source: stdlib[_path.replace(/['"]+/g, '')] || '', 
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
  return Uint8Array.from(__state.zokrates.compile(source));
}
>>>>>>> 0c5a114db61bafc8a680c52d98653443fc85237c
