export function getAbsoluteImportPath(locationPath, relativePath) {
    if (!relativePath.endsWith('.code')) {
        relativePath += '.code';
    }

    relativePath = relativePath.replace(/^(.\/)*/, '')
    
    let locationChunks = locationPath.split('/');
    let relativeChunks = relativePath.split('/');

    let levelCount = relativeChunks.filter(c => c === '..').length;
  
    locationChunks = locationChunks.splice(0, locationChunks.length - levelCount - 1);
    return locationChunks.concat(relativeChunks.splice(levelCount)).join('/');
}