import { saveAs } from 'file-saver';
import React, { useEffect, useReducer } from 'react';
import { Button, ButtonGroup, Col, Form, FormGroup, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { Abi } from '../../common/abiTypes';
import { Alert, LoadingButton } from '../../components';
import { remixClient } from '../../remix/RemixClient';
import { setWitnessResult } from '../../state/actions';
import { useDispatchContext, useStateContext } from '../../state/Store';
import { onError, onFieldUpdate, onLoading, onReset, onSuccess } from './actions';
import { InputComponent } from './components/InputComponent';
import { IComputeWitnessState, witnessReducer } from './reducer';

export const ComputeWitness: React.FC = () => {

    const initialState: IComputeWitnessState = {
        isLoading: false,
        result: null,
        error: '',
        inputFields: {}
    }

    const stateContext = useStateContext();
    const dispatchContext = useDispatchContext();
    const [state, dispatch] = useReducer(witnessReducer, initialState);

    const abi: Abi = JSON.parse(stateContext.compilationResult.artifacts.abi);
    const inputs = abi.inputs;

    useEffect(() => {
        dispatch(onReset());
        dispatchContext(setWitnessResult(''));
    }, [stateContext.compilationResult]);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(onLoading());

        setTimeout(() => {
            try {
                const args = inputs.map(component => state.inputFields[component.name].value);
                let witness = stateContext.zokratesProvider.computeWitness(stateContext.compilationResult.artifacts, args);
                dispatch(onSuccess(witness))
                dispatchContext(setWitnessResult(witness));
            } catch (error) {
                dispatch(onError(error));
            }
        }, 200);
    }

    const openInRemix = () => {
        remixClient.createFile('browser/witness', state.result);
    }

    const onDownload = () => {
        var blob = new Blob([state.result], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, "witness");
    }

    return (
        <>
            <Row>
                <Col>
                    <p>Computes a witness for the compiled program. A witness is a valid assignment of the variables, which include the results of the computation.</p>
                    <Form onSubmit={onSubmit}>
                        {inputs.map((component, index) => {
                            const input = state.inputFields[component.name];
                            return (
                                <FormGroup key={`${component.name}~${index}`}>
                                    <InputComponent 
                                        component={component} 
                                        value={input && input.raw || ''}
                                        onChange={(raw, value) => 
                                            dispatch(onFieldUpdate(component.name, raw, value))
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
                <Alert variant='success' iconClass='fa fa-check'>
                    Witness computed!
            </Alert>
            } 
        </>
    );
}