use wasm_bindgen::prelude::*;
extern crate serde_derive;

#[wasm_bindgen]
pub struct ResolverResult {
    source: String,
    location: String,
}

#[wasm_bindgen]
impl ResolverResult {

    #[wasm_bindgen]
    pub fn new(source: String, location: String) -> Self {
        ResolverResult { source, location }
    }
}

#[wasm_bindgen]
extern "C" {
    fn resolve(l: String, p: String) -> ResolverResult;

    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

use zokrates_core::compile::compile as compile_core;
use zokrates_core::ir;
use zokrates_field::field::FieldPrime;

#[wasm_bindgen]
pub fn compile(source: JsValue) -> JsValue {
   
    fn resolve_closure<'a>(
        l: String,
        p: String,
    ) -> Result<(String, String), zokrates_core::imports::Error> {
        let res = resolve(l, p);
        Ok((res.source, res.location))
    };

    let program_flattened: ir::Prog<FieldPrime> = compile_core(
        source.as_string().unwrap(), "main".to_string(), Some(resolve_closure)).unwrap();

    let data = bincode::serialize(&program_flattened).unwrap();
    JsValue::from_serde(&data).unwrap()
}

#[wasm_bindgen(start)]
pub fn main_js() -> Result<(), JsValue> {

    #[cfg(debug_assertions)]
    console_error_panic_hook::set_once();

    Ok(())
}