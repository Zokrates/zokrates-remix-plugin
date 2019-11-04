interface FunctionArgument {
    name: string,
    type: string,
    modifier: string,
}

export function parseArguments(source: string): FunctionArgument[] {
    var regex = /(?:(private)\s+)?(\w+(?:\[\d+\])*)*\s+(\w+)(?:,|\))/g;
    var lines = source.split('\n');

    let args: FunctionArgument[] = [];
    for (let i = 0; i < lines.length; i++) {
        if (!lines[i].trimLeft().startsWith('def main')) {
            continue;
        }
        let match: RegExpExecArray;
        while (match = regex.exec(lines[i])) {
            var modifier = match[1] || 'public';
            var type = match[2];
            var name = match[3];
            args.push({ name, type, modifier })     
        }
        break;
    }
    return args;
}