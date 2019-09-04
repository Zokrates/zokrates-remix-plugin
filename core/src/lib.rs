use wasm_bindgen::prelude::*;
use zokrates_core::compile::compile as compile_core;
use zokrates_core::ir;
use zokrates_field::field::FieldPrime;
// use zokrates_core::proof_system::*;

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

    let data: Vec<u8> = bincode::serialize(&program_flattened).unwrap();
    JsValue::from_serde(&data).unwrap()
}

// fn get_scheme(scheme_str: &str) -> Result<&'static dyn ProofSystem, String> {
//     match scheme_str.to_lowercase().as_ref() {
//         #[cfg(feature = "libsnark")]
//         "pghr13" => Ok(&PGHR13 {}),
//         #[cfg(feature = "libsnark")]
//         "gm17" => Ok(&GM17 {}),
//         "g16" => Ok(&G16 {}),
//         s => Err(format!("Backend \"{}\" not supported", s)),
//     }
// }

// #[wasm_bindgen]
// pub struct SetupResult {
//     verifying_key: String,
//     proving_key: String,
// }

// #[wasm_bindgen]
// impl SetupResult {
//     #[wasm_bindgen]
//     pub fn new(verifying_key: String, proving_key: String) -> Self {
//         SetupResult { verifying_key, proving_key }
//     }
// }

// #[wasm_bindgen]
// pub fn setup(program: JsValue, scheme: JsValue) -> SetupResult {
//     let default_scheme: String = scheme.into_serde().unwrap_or(String::from("g16"));
//     let scheme = get_scheme(&default_scheme).unwrap();

//     let out: Vec<u8> = program.into_serde().unwrap();
//     let _decoded: ir::Prog<FieldPrime> = bincode::deserialize(&out).unwrap();

//     // TODO: add setup phase
//     // Note: scheme.setup(...) expects file paths (pk_path, vk_path), this has to be changed in the API
//     // Reference: https://github.com/Zokrates/ZoKrates/blob/master/zokrates_core/src/proof_system/bn128/g16.rs#L18

//     SetupResult::new(String::default(), String::default())
// }

#[wasm_bindgen(start)]
pub fn main_js() -> Result<(), JsValue> {

    #[cfg(debug_assertions)]
    console_error_panic_hook::set_once();

    Ok(())
}