import { saveAs } from 'file-saver';
import React, { useEffect, useReducer } from 'react';
import { Button, ButtonGroup, Col, Form, FormGroup, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { Abi } from '../../common/abiTypes';
import { Alert, LoadingButton } from '../../components';
import { remixClient } from '../../remix/RemixClient';
import { setComputationResult } from '../../state/actions';
import { useDispatchContext, useStateContext } from '../../state/Store';
import { onError, onFieldUpdate, onLoading, onReset, onSuccess } from './actions';
import { InputComponent } from './components/InputComponent';
import { computeReducer, IComputeState } from './reducer';

export const Compute: React.FC = () => {

    const initialState: IComputeState = {
        isLoading: false,
        result: null,
        error: '',
        inputFields: {}
    }

    const stateContext = useStateContext();
    const dispatchContext = useDispatchContext();
    const [state, dispatch] = useReducer(computeReducer, initialState);

    const abi: Abi = JSON.parse(stateContext.compilationResult.artifacts.abi);
    const inputs = abi.inputs;

    useEffect(() => {
        dispatch(onReset());
        dispatchContext(setComputationResult(''));
    }, [stateContext.compilationResult]);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(onLoading());

        setTimeout(() => {
            try {
                const args = inputs.map(component => state.inputFields[component.name]);
                let result = stateContext.zokratesProvider.computeWitness(stateContext.compilationResult.artifacts, args);
                dispatch(onSuccess(result))
                dispatchContext(setComputationResult(result));
            } catch (error) {
                dispatch(onError(error));
            }
        }, 200);
    }

    const openInRemix = () => {
        remixClient.createFile('browser/witness', state.result.witness);
    }

    const onDownload = () => {
        var blob = new Blob([state.result.witness], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, "witness");
    }

    return (
        <>
            <Row>
                <Col>
                    <p>Computes a witness for the compiled program. A witness is a valid assignment of the variables, which include the results of the computation.</p>
                    <Form onSubmit={onSubmit}>
                        {inputs.map((component, index) => {
                            const inputValue = state.inputFields[component.name];
                            return (
                                <FormGroup key={`${component.name}~${index}`}>
                                    <InputComponent 
                                        component={component} 
                                        value={inputValue}
                                        onChange={(value) => 
                                            dispatch(onFieldUpdate(component.name, value))
                                    }/>
                                </FormGroup>
                            );
                        }
                        )}
                        <div className="d-flex justify-content-between">
                            <LoadingButton type="submit" 
                                disabled={!stateContext.compilationResult || state.isLoading}
                                defaultText="Compute"
                                loadingText="Computing..."
                                iconClassName="fa fa-lightbulb-o"
                                isLoading={state.isLoading} />
                            <ButtonGroup>
                                <OverlayTrigger 
                                    placement="top" 
                                    overlay={<Tooltip id="tooltip-remix-witness">Open in Remix Editor</Tooltip>}>
                                    <Button disabled={!state.result} variant="light" onClick={openInRemix}>
                                        <i className="fa fa-share" aria-hidden="true"></i>
                                    </Button>
                                </OverlayTrigger>
                                <OverlayTrigger 
                                    placement="top" 
                                    overlay={<Tooltip id="tooltip-download-witness">Download</Tooltip>}>
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
            <>
                <Alert variant='success' iconClass='fa fa-check'>
                    Computed successfully!
                </Alert>
                <pre className="bg-light p-2 mt-3 mb-0">
                    <code>
                        {state.result.output}
                    </code>
                </pre>
            </>
            }
        </>
    );
}