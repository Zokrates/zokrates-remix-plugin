import { saveAs } from 'file-saver';
import copy from 'copy-to-clipboard';
import React, { useEffect, useReducer } from 'react';
import { Button, ButtonGroup, Col, Form, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { generateProof } from '../../../../core';
import { Alert, LoadingButton } from '../../components';
import { remixClient } from '../../remix/remix-client';
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
    }, [stateContext.compilationResult, stateContext.witnessResult, stateContext.setupResult]);

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

    const onCopy = () => {
        copy(state.result);
    }

    const openInRemix = () => {
        remixClient.createFile('browser/proof.out', state.result);
    }

    const onDownload = () => {
        var blob = new Blob([state.result], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, 'proof.out');
    }

    const requirementsConstraint = 
        !stateContext.compilationResult || 
        !stateContext.witnessResult || 
        !stateContext.setupResult;

    return (
        <>
            {requirementsConstraint && 
                <Row>
                    <Col>
                        <Alert variant='primary' iconClass='fa fa-exclamation-circle'>
                            Please complete all phases before generating proof!
                        </Alert>
                    </Col>
                </Row>
            }
            <Row>
                <Col>
                    <p>Generates a proof for a computation of the compiled program using proving key and computed witness.</p>
                    <Form onSubmit={onSubmit}>
                        <div className="d-flex justify-content-between">
                            <LoadingButton type="submit" disabled={requirementsConstraint}
                                defaultText="Generate" 
                                loadingText="Generating..." 
                                iconClassName="fa fa-check" 
                                isLoading={state.isLoading} />
                            <ButtonGroup>
                                <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-copy-proof">Copy</Tooltip>}>
                                    <Button disabled={!state.result} variant="light" onClick={onCopy}>
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