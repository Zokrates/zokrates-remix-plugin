var state = {
  zokrates: {}
};

export const init = async (callback) => {
  let wasm = await import('./pkg');
  state.zokrates = wasm;

  window.resolve = (location, path) => {
    let result = callback(location, path)
    return state.zokrates.ResolverResult.new(result.source, result.location);
  }

  return wasm;
}

export const compile = (source) => {
  return state.zokrates.compile(source);
}