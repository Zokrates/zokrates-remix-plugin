import { saveAs } from 'file-saver';
import React, { useReducer } from 'react';
import { Button, ButtonGroup, Col, OverlayTrigger, Row, Tooltip, Spinner } from 'react-bootstrap';
import { generateProof } from '../../../../core';
import { Alert } from '../../common/alert';
import { remixClient } from '../../remix/remix-client';
import { setGenerateProofResult } from '../../state/actions';
import { useDispatchContext, useStateContext } from '../../state/Store';
import { onError, onSuccess, onLoading } from './actions';
import { generateProofReducer } from './reducer';

export const GenerateProof: React.FC = () => {

    const stateContext = useStateContext();
    const dispatchContext = useDispatchContext();

    const [state, dispatch] = useReducer(generateProofReducer, {})

    const onGenerateProof = () => {
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
                    <div className="d-flex justify-content-between">
                        <Button onClick={onGenerateProof} variant="primary" type="submit" disabled={requirementsConstraint}>
                            {(() => {
                                if (state.isLoading) {
                                    return (
                                        <>
                                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                            <span className="ml-2">Generating...</span>
                                        </>
                                    );
                                }
                                return (
                                    <>
                                        <i className="fa fa-check" aria-hidden="true"></i>
                                        <span className="ml-2">Generate</span>
                                    </>
                                )
                            })()}
                        </Button>
                        <ButtonGroup>
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
                Setup completed!
            </Alert>
            }
        </>
    )
}