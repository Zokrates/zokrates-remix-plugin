use wasm_bindgen::prelude::*;
use zokrates_core::compile::{ compile as compile_core, CompileErrors };
use zokrates_core::ir;
use zokrates_field::field::{Field, FieldPrime};
use zokrates_core::proof_system::{self, ProofSystem};

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
pub fn compile(source: JsValue, location: JsValue) -> Result<JsValue, JsValue> {
    fn resolve_closure<'a>(
        l: String,
        p: String,
    ) -> Result<(String, String), zokrates_core::imports::Error> {
        let res = resolve(l, p);
        Ok((res.source, res.location))
    };

    let program_flattened: Result<ir::Prog<FieldPrime>, CompileErrors> = compile_core(
        source.as_string().unwrap(), 
        location.as_string().unwrap(), 
        Some(resolve_closure)
    );

    match program_flattened {
        Ok(p) => {
            let data: Vec<u8> = bincode::serialize(&p).unwrap();
            Ok(JsValue::from_serde(&data).unwrap())
        }
        Err(ce) => Err(JsValue::from_str(&format!("{}", ce)))
    }
}

#[wasm_bindgen]
pub fn compute_witness(program: JsValue, args: JsValue) -> Result<JsValue, JsValue> {
    let out: Vec<u8> = program.into_serde().unwrap();
    let program_flattened: ir::Prog<FieldPrime> = bincode::deserialize(&out).unwrap();

    let js_args: Vec<String> = args.into_serde().unwrap();
    let arguments: Vec<FieldPrime> = js_args.iter()
                    .map(|x| FieldPrime::try_from_dec_str(x.as_str()).unwrap())
                    .collect();

    let witness = program_flattened.execute(&arguments);
    match witness {
        Ok(witness) => Ok(JsValue::from_str(&format!("{}", witness))),
        Err(error) => Err(JsValue::from_str(&format!("{}", error)))
    }
}

#[wasm_bindgen]
pub fn setup(program: JsValue) -> JsValue {
    let out: Vec<u8> = program.into_serde().unwrap();
    let program_flattened: ir::Prog<FieldPrime> = bincode::deserialize(&out).unwrap();

    let proof: (String, Vec<u8>) = proof_system::G16{}.setup_c(program_flattened);
    JsValue::from_serde(&proof).unwrap()
}

#[wasm_bindgen]
pub fn export_solidity_verifier(vk: JsValue, is_abiv2: JsValue) -> JsValue {
    let verifier: String = proof_system::G16{}.export_solidity_verifier_c(
        vk.as_string().unwrap(), 
        is_abiv2.as_bool().unwrap()
    );
    JsValue::from_str(verifier.as_str())
}

#[wasm_bindgen]
pub fn generate_proof(program: JsValue, witness: JsValue, pk: JsValue) -> JsValue {
    let out: Vec<u8> = program.into_serde().unwrap();
    let program_flattened: ir::Prog<FieldPrime> = bincode::deserialize(&out).unwrap();

    let str_witness: String = witness.as_string().unwrap();
    let witness_out: ir::Witness<FieldPrime> = ir::Witness::read(str_witness.as_bytes()).unwrap();
        
    let mut proving_key: Vec<u8> = pk.into_serde().unwrap();

    let proof: String = proof_system::G16{}.generate_proof_c(program_flattened, witness_out, proving_key.as_mut_slice());
    JsValue::from_str(proof.as_str())
}

#[wasm_bindgen(start)]
pub fn main_js() -> Result<(), JsValue> {

    #[cfg(debug_assertions)]
    console_error_panic_hook::set_once();

    Ok(())
}