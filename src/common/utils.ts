const precomputedHexOctets = [];

for (let n = 0; n <= 0xff; n++) {
    let hexOctet = n.toString(16);
    if (hexOctet.length < 2) {
        hexOctet = "0".concat(hexOctet);
    }
    precomputedHexOctets.push(hexOctet);
}

export function hex(buffer: Uint8Array){
    const hexOctets = new Array(buffer.length);
    for (let i = 0; i < buffer.length; i++)
        hexOctets[i] = precomputedHexOctets[buffer[i]];

    return hexOctets.join('');
}