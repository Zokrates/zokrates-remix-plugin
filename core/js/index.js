// import("../pkg/index.js").then(zokrates => {
// 	window.zokrates = zokrates;
// });

import { ZoKrates } from "./library";

async function load() {
	let zokrates = new ZoKrates();
	await zokrates.init((location, path) => {
		console.log(location + " is resolving dependency '" + path + "'")
		return {
			source: "def main() -> ():\nreturn", 
			location: path
		}
	});

	zokrates.compile("import \"test\" as test\ndef main() -> ():\nreturn");
}

load();

// import("../pkg/index.js").then(zokrates => {
// 	window.zokrates = zokrates;
// 	zokrates.resolve = function (location, path) {
// 		console.log(location + " is resolving dependency '" + path + "'")
// 		return zokrates.ResolverResult.new("def main() -> ():\nreturn", path)
// 	}
// })