use wasm_bindgen::prelude::*;

type Location = String;

// the path to a file, just for clarity here
type Path = String;

// some zokrates source, just for clarity
type Source = String;

#[wasm_bindgen]
pub struct ResolverResult {
    source: Source,
    location: Location,
}

#[wasm_bindgen]
impl ResolverResult {
    pub fn new(source: Source, location: Location) -> Self {
        ResolverResult { source, location }
    }
}

// #[wasm_bindgen]
// extern "C" {
//     fn resolve(l: Location, p: Path) -> ResolverResult;
// }

#[wasm_bindgen]
extern "C" {
    fn resolve(l: Location, p: Path) -> ResolverResult;
}


use zokrates_core::compile::compile as compile_core;
use zokrates_field::field::FieldPrime;

#[wasm_bindgen]
/// this is the function that we expose to the user, and to which the user can pass their own resolver
/// they pass their source and a resolver like `s.compile("def main() -> (): return", resolve)`
pub fn compile(source: JsValue) -> JsValue {
    // Here we create a rust closure which calls the passed resolver when called
    // it is assumed that `resolver` is actually a function with one variable, it is the responsibility of the caller (say remix) to enforce that
    fn resolve_closure<'a>(
        l: Location,
        p: Path,
    ) -> Result<(Source, Location), zokrates_core::imports::Error> {
        let res = resolve(l, p.to_string());
        Ok((res.source, res.location))
    };

    // we call the zokrates compile function with our closure
    compile_core::<FieldPrime, _>(
        source.as_string().unwrap(),
        "main".to_string(),
        Some(resolve_closure),
    )
    .unwrap()
    .to_string()
    .into()
}

// generic things, were in the template I used for this
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

// This is like the `main` function, except for JavaScript.
#[wasm_bindgen(start)]
pub fn main_js() -> Result<(), JsValue> {
    // This provides better error messages in debug mode.
    // It's disabled in release mode so it doesn't bloat up the file size.
    #[cfg(debug_assertions)]
    console_error_panic_hook::set_once();

    Ok(())
}
