import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import React, { useEffect, useReducer } from 'react';
import { Button, ButtonGroup, Col, Form, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { Alert, LoadingButton } from '../../components';
import { setSetupResult } from '../../state/actions';
import { useDispatchContext, useStateContext } from '../../state/Store';
import { onCleanup, onError, onLoading, onSuccess } from './actions';
import { ISetupState, setupReducer } from './reducer';
import { WA_SETUP, WA_ERROR } from '../../zokrates/constants';

export const Setup: React.FC = () => {

    const initialState: ISetupState = {
        isLoading: false,
        result: null,
        error: ''
    }

    const stateContext = useStateContext();
    const dispatchContext = useDispatchContext();
    const [state, dispatch] = useReducer(setupReducer, initialState);
    const { zokratesWebWorker } = stateContext;

    const onWorkerMessage = (e: MessageEvent) => {
        switch (e.data.type) {
            case WA_SETUP: {
                dispatch(onSuccess(e.data.payload));
                dispatchContext(setSetupResult(e.data.payload));
                break;
            }
            case WA_ERROR: {
                dispatch(onError(e.data.payload));
                break;
            }
            default:
                break;
        }
    }

    useEffect(() => {
        const subscription = zokratesWebWorker.onMessage().subscribe(onWorkerMessage);
        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        dispatch(onCleanup());
        dispatchContext(setSetupResult(null));
    }, [stateContext.compilationResult]);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(onLoading());

        setTimeout(() => {
            try {
                zokratesWebWorker.postMessage(WA_SETUP, {
                    program: stateContext.compilationResult.artifacts.program
                });
            } catch (error) {
                dispatch(onError(error.toString()));
            }
        }, 200)
    }

    const onDownload = () => {
        let zip = new JSZip();
        zip.file("verifying.key", JSON.stringify(state.result.vk, null, 2));
        zip.file("proving.key", state.result.pk);
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