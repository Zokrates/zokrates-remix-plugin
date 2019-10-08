interface Argument {
    field: string,
    modifier: string,
    type: string,
}

export function parseArguments(source: string): Argument[] {
    var regex = /(?:(private)[\s]+)?(field|bool)(?:\[([0-9]+)\])?\s+([a-zA-Z0-9_]+)/g;
    var lines = source.split('\n');

    let args: Argument[] = [];
    for (let i = 0; i < lines.length; i++) {
        if (!lines[i].startsWith('def main')) {
            continue;
        }
        let match: RegExpExecArray;
        while (match = regex.exec(lines[i])) {
            var modifier = match[1] || 'public';
            var type = match[2];
            if (match[3]) {
                let arraySize = Number(match[3]);
                let array = [...Array(arraySize).keys()];

                let varName = match[4];
                array.forEach(index => args.push({
                    field: `${varName}_${index}`,
                    modifier,
                    type
                }));
            } else {
                args.push({
                    field: match[4],
                    modifier,
                    type
                });
            }      
        }
        break;
    }
    return args;
}