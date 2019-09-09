const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

const isNode =
  typeof process !== 'undefined' &&
  process.versions != null &&
  process.versions.node != null;


export function platform() {
    if (isBrowser) {
        return window;
    } else if (isNode) {
        return global;
    } else {
        throw new Error('Your platform is not supported')
    }
}

export function getAbsolutePath(basePath, relativePath) {
    var stack = basePath.split('/');
    var chunks = relativePath.split('/');

    stack.pop();

    for(var i = 0; i < chunks.length; i++) {
        if (chunks[i] == ".") {
            continue;
        } else if (chunks[i] == "..") {
            stack.pop();
        } else {
            stack.push(chunks[i]);
        }
    }
    return stack.join('/');
}