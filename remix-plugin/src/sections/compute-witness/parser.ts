export function parseArguments(source: string) {
    var regex = /field(?:\[([0-9]+)\])?\s+([a-zA-Z0-9_]+)/g;
    var lines = source.split('\n');

    let args = [];
    for (let i = 0; i < lines.length; i++) {
        if (!lines[i].startsWith('def main')) {
            continue;
        }
            
        let match: RegExpExecArray;
        while (match = regex.exec(lines[i])) {
            if (match[1]) {
                let arraySize = Number(match[1]);
                let array = [...Array(arraySize).keys()];

                let varName = match[2];
                array.forEach(index => args.push(`${varName}_${index}`));
            } else {
                args.push(match[2]);
            }      
        }
        break;
    }
    return args;
}