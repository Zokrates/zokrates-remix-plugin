export function getAbsolutePath(basePath: string, relativePath: string): string {
    if (relativePath[0] !== '.')
        return relativePath;

    let stack = basePath.split('/');
    let chunks = relativePath.split('/');
    stack.pop();

    for (let i = 0; i < chunks.length; i++) {
        if (chunks[i] === '.') {
            continue;
        } else if (chunks[i] === '..') {
            stack.pop();
        } else {
            stack.push(chunks[i]);
        }
    }
    return stack.join('/');
}

export function getImportPath(currentLocation: string, importLocation: string) {
    let path = getAbsolutePath(currentLocation, importLocation);
    let extension = path.slice((path.lastIndexOf('.') - 1 >>> 0) + 2);
    return extension ? path : path.concat('.zok');
}