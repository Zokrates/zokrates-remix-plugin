## How to install

```sh
npm install
```

## How to run in debug mode

```sh
# Builds the project and opens it in a new browser tab. Auto-reloads when the project changes.
npm start
```

## What is happening

`js/index.js` defines a resolver as a JS function and makes it available in `window`.

In the browser terminal, execute the following:
```js
zokrates.compile("import \"/path/to/dep\" as dep\ndef main(field a, field b) -> (field):\nreturn a*b")
```

The resolver is defined in `js/index.js` and is mocked to return `def main() -> ():\nreturn` for now.

Right now the API of the resolver is:
`fn resolve(l: Location, p: ImportPath) -> ResolverResult`
Where `ResolverResult` is a js class with static method `new(s: SourceCode, l: Location)`

We pass the current Location (the file the import was found in) and the import path (can be relative or absolute)
We return the content of the file at the import path as well as its location.


