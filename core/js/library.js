export class ZoKrates {

    async init(callback) {
        this.wasm = await import("../pkg/index.js");
        window.resolve = (location, path) => {
            let result = callback(location, path)
            console.log(result);
            return this.wasm.ResolverResult.new(result.source, result.location);
        }
        return this.wasm;
    }

    compile(source) {
        return this.zokrates.compile(source);
    }
}

// var wasm = import("../pkg/index.js").then(instance => wasm = instance);

// export function resolve(location, path) {
//     console.log("Resolving " + location + " -> " + path);
//     return wasm.ResolverResult.new("def main() -> ():\nreturn", path);
// }