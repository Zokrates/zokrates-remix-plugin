# Zokrates.js

## Prerequisites

Install wasm-pack
`https://rustwasm.github.io/wasm-pack/installer/`

## Instalation

To setup run `npm run setup`.
After that is finished run `npm run start`.

## Troubleshooting

**The project doesn't compile**.

In order to compile this project you need the *nightly* version of Rust, and the ability to compile to WASM. You can install all of this by running:

```
rustup install nightly
rustup target add wasm32-unknown-unknown --toolchain nightly
rustup default nightly
```