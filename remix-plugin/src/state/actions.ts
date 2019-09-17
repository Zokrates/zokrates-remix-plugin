import { IActions } from './reducer';
import { SetupResult } from './types';

export const setCompileResult = (program: any, source: string): IActions => {
    return {
        type: 'set_compile_result', 
        payload: { 
            program, source 
        }
    }
}

export const setWitnessResult = (witness: string): IActions => {
    return {
        type: 'set_witness_result', 
        payload: witness
    }
}

export const setSetupResult = (result: SetupResult): IActions => {
    return {
        type: 'set_setup_result', 
        payload: result
    }
}

export const setExportVerifierResult = (verifier: string): IActions => {
    return {
        type: 'set_export_verifier_result', 
        payload: verifier
    }
}

export const setGenerateProofResult = (proof: string): IActions => {
    return {
        type: 'set_generate_proof_result', 
        payload: proof
    }
}