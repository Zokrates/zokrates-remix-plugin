import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import React, { useEffect, useReducer } from 'react';
import { Button, ButtonGroup, Col, Form, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { setup } from 'zokrates-js';
import { Alert, LoadingButton } from '../../components';
import { setSetupResult } from '../../state/actions';
import { useDispatchContext, useStateContext } from '../../state/Store';
import { SetupResult } from '../../state/types';
import { onCleanup, onError, onLoading, onSuccess } from './actions';
import { ISetupState, setupReducer } from './reducer';

export const Setup: React.FC = () => {

    const initialState: ISetupState = {
        isLoading: false,
        result: null,
        error: ''
    }

    const stateContext = useStateContext();
    const dispatchContext = useDispatchContext();
    const [state, dispatch] = useReducer(setupReducer, initialState)

    useEffect(() => {
        dispatch(onCleanup());
        dispatchContext(setSetupResult(null));
    }, [stateContext.compilationResult]);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(onLoading());

        setTimeout(() => {
            try {
                let result = setup(stateContext.compilationResult.program);
                let setupResult: SetupResult = {
                    verificationKey: result[0], provingKey: result[1]
                }
                dispatch(onSuccess(setupResult));
                dispatchContext(setSetupResult(setupResult));
            } catch (error) {
                dispatch(onError(error.toString()));
            }
        }, 200)
    }

    const onDownload = () => {
        let zip = new JSZip();
        zip.file("verifying.key", state.result.verificationKey);
        zip.file("proving.key", state.result.provingKey.buffer);
        zip.generateAsync({ type: "blob" }).then((content: any) => saveAs(content, "keys.zip"));
    }
    
    return (
        <>
            <Row>
                <Col> 
                    <p>Creates a proving key and a verification key. These keys are derived from a source of randomness, commonly referred to as “toxic waste”.</p>
                    <Form onSubmit={onSubmit}>
                        <div className="d-flex justify-content-between">
                            <LoadingButton type="submit" disabled={!stateContext.compilationResult || state.isLoading}
                                defaultText="Run Setup" 
                                loadingText="Running setup..." 
                                iconClassName="fa fa-cog" 
                                isLoading={state.isLoading} />
                            <ButtonGroup>
                                <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-download-keys">Download Keys</Tooltip>}>
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
                Setup completed!
            </Alert>
            }
        </>
    );
}