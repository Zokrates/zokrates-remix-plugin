import React, { useReducer } from 'react';
import { Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { exportSolidityVerifier } from '../../../../core';
import { remixClient } from '../../remix/remix-client';
import { IExportVerifierState, exportVerifierReducer } from './reducer';
import { onError, onSuccess, onGenerating, onFieldChange } from './actions';
import { showAlert } from '../../common/alert';

export const ExportSolidityVerifier: React.FC = () => {
    
    const mock = {
        vk: "vk.alpha = 0x1353dd2bd1a894a98fb6fb2c293f4ef451d0d39437725dbb2498616378757480, 0x25f7074e027e52dc4dab5e1085e030254e6bfa68d92b63e215995b4ce1355f2b\nvk.beta = [0x1d5ce41f52fe445c3a2ad51c36187c0f474c2dec69c46af745a4f73c369870a4, 0x0aeceaa0e83256c0684b8767f43096771ea7b81d7c28b11b380b61ed4d74165b],[0x2e5b49381bd134363c1b3b09f77a958fdfc53077ce0621150c4c92c374e824b3, 0x2f4de15a18b83f1ef614146f864e4ea9594559e764a620d58ec9440c8548e956]\nvk.gamma = [0x2f255e5e9275f9a2106d02a02c72f4ef2ec93178663c356ba77541edb929e5b6, 0x0b9c7c00cfb8554319fe9ea86fc83a6b0031f886dcc955abd554c34124c2f43d],[0x05dfabf3039c8fc2efba2088af2456fbf79146c89fc04ff94eabb0f9326ff737, 0x237c188d7173e0abe59ca037304544f5ed16e12ad21f4fb8e816ac3049d4d87b]\nvk.delta = [0x199472c45f69910f0eae322d0bfe8343bbcc01b430d6b16440485ffb35052762, 0x26890d59b5d1bf450c16b9787956524d57923144f1eed5680ba1a54f907ee5cc],[0x16f955bc2d72103278b2b9fafb30ad25e812314d99c2358a5f6a95af1c10ed0f, 0x08138c3f1ca83cb7340df1cceb28d08922bc4850ad86660f6f0437af53a67802]\nvk.gamma_abc.len() = 3\nvk.gamma_abc[0] = 0x0167d55f321c3d756ebe21f51b018e1e84b484b7b903b8462cecb9882e0cf320, 0x17c584604a013570cb0069092edf73ac1cd86141f03a5c39c793ba4dd4eacdf9\nvk.gamma_abc[1] = 0x07a86c3be13527f8e3f79681fb8864ae430125a6a543e2e33cdf227546908c3f, 0x1e76dc6d64bac5dd8b03706b042018909d2e77a4dde23f2697e422c6df6c70bf\nvk.gamma_abc[2] = 0x10da1d98452d6f03d9924b9dc7090b428dfeeb5ee5105caaedc17ee576875955, 0x25c41e501c0efcb3f060fce557d1b1601a761752502be06653f174f9ce33d4d2",
        abiv2: true
    }

    const initialState: IExportVerifierState = {
        isGenerating: false,
        fields: {
            vk: mock.vk,
            abiv2: mock.abiv2
        },
        result: null,
        error: ''
    }

    const [state, dispatch] = useReducer(exportVerifierReducer, initialState);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(state);
        try {
            dispatch(onGenerating());
            setTimeout(async () => {
                try {
                    let verifierCode = exportSolidityVerifier(state.fields.vk, state.fields.abiv2);
                    dispatch(onSuccess(verifierCode));
        
                    await remixClient.createFile('browser/verifier.sol', verifierCode);
                } catch (error) {
                    dispatch(onError(error.toString()));
                }
            }, 200);
        } catch (error) {
            dispatch(onError(error.toString()));
        }
    }

    return (
        <>
            <Row>
                <Col>
                    <Form onSubmit={onSubmit}>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Verifying Key</Form.Label>
                            <Form.Control type="text" name="vk" value={state.fields.vk || ''} onChange={(event: any) => {
                                dispatch(onFieldChange("vk", event.currentTarget.value))}
                            }/>
                        </Form.Group>
                        <Form.Group controlId="formBasicCheckbox">
                            <Form.Check type="checkbox" label="ABI v2" name="abiv2" checked={state.fields.abiv2 || false} onChange={(event: any) => {
                                dispatch(onFieldChange("abiv2", event.currentTarget.checked))}
                            }/>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            {(() => {
                                if (state.isGenerating) {
                                    return (
                                        <>
                                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                            <span className="ml-2">Generating...</span>
                                        </>
                                    );
                                }
                                return (
                                    <>
                                        <i className="fa fa-key" aria-hidden="true"></i>
                                        <span className="ml-2">Generate Solidity Verifier</span>
                                    </>
                                )
                            })()}   
                        </Button>
                    </Form>
                </Col>
            </Row>
            {state.error && showAlert('danger', 'fa fa-exclamation-circle', state.error)}
            {state.result && showAlert('success', 'fa fa-check', 'Solidity verifier generated!')}
        </>
    );
}