
export function parseArguments(source: string) {
    var regex = /field(?:\[[0-9]+\])?\s+([a-zA-Z0-9_]+)/g
    var lines = source.split('\n');

    let args = [];
    for (let i = 0; i < lines.length; i++) {
        if (!lines[i].startsWith('def main')) {
            continue;
        }
            
        let match: RegExpExecArray;
        while (match = regex.exec(lines[i])) {
            args.push(match[1]);
        }
        break;
    }
    return args;
}