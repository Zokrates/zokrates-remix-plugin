export function getAbsoluteImportPath(basePath, relativePath) {
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