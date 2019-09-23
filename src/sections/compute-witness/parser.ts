interface Argument {
    field: string,
    modifier: string,
}

export function parseArguments(source: string): Argument[] {
    var regex = /(?:(private)[\s]+)?field(?:\[([0-9]+)\])?\s+([a-zA-Z0-9_]+)/g;
    var lines = source.split('\n');

    let args: Argument[] = [];
    for (let i = 0; i < lines.length; i++) {
        if (!lines[i].startsWith('def main')) {
            continue;
        }
        let match: RegExpExecArray;
        while (match = regex.exec(lines[i])) {
            var modifier = match[1] || 'public';
            if (match[2]) {
                let arraySize = Number(match[2]);
                let array = [...Array(arraySize).keys()];

                let varName = match[3];
                array.forEach(index => args.push({
                    field: `${varName}_${index}`,
                    modifier
                }));
            } else {
                args.push({
                    field: match[3],
                    modifier
                });
            }      
        }
        break;
    }
    return args;
}