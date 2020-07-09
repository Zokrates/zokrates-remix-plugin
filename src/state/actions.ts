import { IActions } from './reducer';
import { ExportVerifierResult } from './types';
import { ZoKratesWebWorker } from '../zokrates/ZoKratesWebWorker';
import { SetupKeypair } from 'zokrates-js';

export const onLoaded = (worker: ZoKratesWebWorker): IActions => {
    return {
        type: 'set_loaded',
        payload: worker
    }
}

export const setCompilationResult = (artifacts: any, source: string): IActions => {
    return {
        type: 'set_compilation_result', 
        payload: { 
            artifacts, source 
        }
    }
}

export const setComputationResult = (output: any): IActions => {
    return {
        type: 'set_computation_result', 
        payload: output
    }
}

export const setSetupResult = (keypair: SetupKeypair): IActions => {
    return {
        type: 'set_setup_result', 
        payload: keypair
    }
}

export const setExportVerifierResult = (result: ExportVerifierResult): IActions => {
    return {
        type: 'set_export_verifier_result', 
        payload: result
    }
}

export const setGenerateProofResult = (proof: string): IActions => {
    return {
        type: 'set_generate_proof_result', 
        payload: proof
    }
}