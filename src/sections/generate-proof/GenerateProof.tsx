import copy from 'copy-to-clipboard';
import { saveAs } from 'file-saver';
import React, { useEffect, useReducer } from 'react';
import { Button, ButtonGroup, Col, Form, FormControl, FormLabel, InputGroup, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { generateProof } from 'zokrates-js';
import { Alert, LoadingButton } from '../../components';
import { remixClient } from '../../remix/RemixClient';
import { setGenerateProofResult } from '../../state/actions';
import { useDispatchContext, useStateContext } from '../../state/Store';
import { onCleanup, onError, onLoading, onSuccess } from './actions';
import { generateProofReducer, IGenerateProofState } from './reducer';

export const GenerateProof: React.FC = () => {

    const initialState: IGenerateProofState = {
        isLoading: false,
        result: '',
        error: ''
    }

    const stateContext = useStateContext();
    const dispatchContext = useDispatchContext();
    const [state, dispatch] = useReducer(generateProofReducer, initialState);

    useEffect(() => {
        dispatch(onCleanup());
        dispatchContext(setGenerateProofResult(''));
    }, [stateContext.compilationResult, 
        stateContext.witnessResult, 
        stateContext.setupResult, 
        stateContext.exportVerifierResult]);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(onLoading());

        setTimeout(() => {
            try {
                let proof = generateProof(
                    stateContext.compilationResult.program,
                    stateContext.witnessResult,
                    stateContext.setupResult.provingKey
                );
    
                dispatch(onSuccess(proof));
                dispatchContext(setGenerateProofResult(proof));
            } catch (error) {
                dispatch(onError(error.toString()));
            }
        }, 200);
    }

    const onCopy = (value: string) => {
        copy(value);
    }

    const openInRemix = () => {
        remixClient.createFile('browser/proof.out', state.result);
    }

    const onDownload = () => {
        var blob = new Blob([state.result], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, 'proof.out');
    }

    const getCompatibleParametersFormat = (input: string, abiv2: boolean) => {
        const json = JSON.parse(input);
        const proofValues = Object.values(json.proof).map(el => JSON.stringify(el)).join();
        const inputValues = JSON.stringify(json.inputs);
        if (abiv2) {
            return `[${proofValues}],${inputValues}`;
        }
        return `${proofValues},${inputValues}`;
    }

    return (
        <>
            <Row>
                <Col>
                    <p>Generates a proof for a computation of the compiled program using proving key and computed witness.</p>
                    <Form onSubmit={onSubmit}>
                        <div className="d-flex justify-content-between">
                            <LoadingButton type="submit" className="btn-overflow" disabled={!stateContext.compilationResult || !stateContext.witnessResult || !stateContext.setupResult || state.isLoading}
                                defaultText="Generate" 
                                loadingText="Generating..." 
                                iconClassName="fa fa-check" 
                                isLoading={state.isLoading} />
                            <ButtonGroup>
                                <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-copy-output">Copy Output</Tooltip>}>
                                    <Button disabled={!state.result} variant="light" onClick={() => onCopy(state.result)}>
                                        <i className="fa fa-clipboard" aria-hidden="true"></i>
                                    </Button>
                                </OverlayTrigger>
                                <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-remix-proof">Open in Remix Editor</Tooltip>}>
                                    <Button disabled={!state.result} variant="light" onClick={openInRemix}>
                                        <i className="fa fa-share" aria-hidden="true"></i>
                                    </Button>
                                </OverlayTrigger>
                                <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-download-proof">Download</Tooltip>}>
                                    <Button disabled={!state.result} variant="light" onClick={onDownload}>
                                        <i className="fa fa-download" aria-hidden="true"></i>
                                    </Button>
                                </OverlayTrigger>
                            </ButtonGroup>
                        </div>
                    </Form>
                </Col>
            </Row>
            {state.result && (() => {
                const result = getCompatibleParametersFormat(state.result, stateContext.exportVerifierResult.abiv2);
                return (
                    <Row>
                        <Col>
                            <FormLabel>Remix compatible parameters:</FormLabel>
                            <InputGroup>
                                <FormControl aria-label="Parameters" value={result} readOnly />
                                <InputGroup.Append>
                                    <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-copy-parameters">Copy Parameters</Tooltip>}>
                                        <Button disabled={!state.result} onClick={() => onCopy(result)}>
                                            <i className="fa fa-clipboard" aria-hidden="true"></i>
                                        </Button>
                                    </OverlayTrigger>
                                </InputGroup.Append>
                            </InputGroup>
                        </Col>
                    </Row>
                );
            })()}
            {state.error && 
            <Alert variant='danger' iconClass='fa fa-exclamation-circle'>
                <pre>
                    <code>{state.error}</code>
                </pre>
            </Alert>
            }
            {state.result && 
            <Alert variant='success' iconClass='fa fa-check'>
                Proof generated!
            </Alert>
            }
        </>
    )
}