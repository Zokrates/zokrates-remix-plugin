const precomputedHexOctets = [];

for (let n = 0; n <= 0xff; n++) {
    let hexOctet = n.toString(16);
    if (hexOctet.length < 2) {
        hexOctet = "0".concat(hexOctet);
    }
    precomputedHexOctets.push(hexOctet);
}

export function hex(buffer: Uint8Array) {
    const hexOctets = new Array(buffer.length);
    for (let i = 0; i < buffer.length; i++)
        hexOctets[i] = precomputedHexOctets[buffer[i]];

    return hexOctets.join('');
}

export function getAbsolutePath(basePath: string, relativePath: string): string {
    var stack = basePath.split('/');
    var chunks = relativePath.split('/');
    stack.pop();

    for (var i = 0; i < chunks.length; i++) {
        if (chunks[i] == '.') {
            continue;
        } else if (chunks[i] == '..') {
            stack.pop();
        } else {
            stack.push(chunks[i]);
        }
    }
    return stack.join('/');
}

export function getImportPath(currentLocation: string, importLocation: string) {
    let path = getAbsolutePath(currentLocation, importLocation);
    let extension = importLocation.slice((path.lastIndexOf(".") - 1 >>> 0) + 2);
    return extension ? path : path.concat('.zok');
}