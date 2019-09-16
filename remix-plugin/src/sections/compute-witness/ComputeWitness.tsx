import { saveAs } from 'file-saver';
import React, { useEffect, useReducer } from 'react';
import { Button, ButtonGroup, Col, Form, FormControl, InputGroup, OverlayTrigger, Row, Spinner, Tooltip } from 'react-bootstrap';
import { computeWitness } from '../../../../core';
import { Alert } from '../../common/alert';
import { remixClient } from '../../remix/remix-client';
import { setWitnessResult } from '../../state/actions';
import { useDispatchContext, useStateContext } from '../../state/Store';
import { onCleanup, onLoading, onError, onFieldChange, onSuccess } from './actions';
import { parseArguments } from './parser';
import { IComputeWitnessState, witnessReducer } from './reducer';

export const ComputeWitness: React.FC = () => {

    const initialState: IComputeWitnessState = {
        isLoading: false,
        fields: {},
        result: null,
        error: ''
    }

    const stateContext = useStateContext();
    const dispatchContext = useDispatchContext();
    const [state, dispatch] = useReducer(witnessReducer, initialState);

    useEffect(() => {
        dispatch(onCleanup());
        dispatchContext(setWitnessResult(''));
    }, [stateContext.compilationResult]);

    const compute = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(onLoading());
        
        setTimeout(() => {
            try {
                let args: string[] = Object.values(state.fields);
                let witness = computeWitness(stateContext.compilationResult.program, args);

                dispatch(onSuccess(witness))
                dispatchContext(setWitnessResult(witness));
            } catch (error) {
                dispatch(onError(error));
            }
        }, 200);
    }

    const openInRemix = () => {
        remixClient.createFile('browser/witness.out', state.result);
    }

    const onDownload = () => {
        var blob = new Blob([state.result], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, "witness.out");
    }

    const renderInputFields = () => {
        if (!stateContext.compilationResult) {
            return;
        }
        const args = parseArguments(stateContext.compilationResult.source);
        return args.map((e, i) =>
            <InputGroup key={i} className="mb-3">
                <InputGroup.Prepend>
                    {e.modifier == 'private' && 
                    <OverlayTrigger key={e.field} placement="top" overlay={<Tooltip id={`tooltip-${e.field}`}>Private Field</Tooltip>}>
                        <InputGroup.Text><i className="fa fa-lock" aria-hidden="true"></i></InputGroup.Text>
                    </OverlayTrigger>}
                    <InputGroup.Text>{e.field}</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl placeholder="Value" type="number" name={`${e.field}`} value={state.fields[e.field] || ''} required={true} onChange={(event: any) =>
                    dispatch(onFieldChange(e.field, event.currentTarget.value))} />
            </InputGroup>
        );
    }

    return (
        <>
            {!stateContext.compilationResult && 
                <Row>
                    <Col>
                        <Alert variant='primary' iconClass='fa fa-exclamation-circle'>
                            Please compile your program before running setup!
                        </Alert>
                    </Col>
                </Row>
            }
            <Row>
                <Col>
                    <p>Computes a witness for the compiled program. A witness is a valid assignment of the variables, which include the results of the computation.</p>
                    <Form onSubmit={compute}>
                        {renderInputFields()}
                        <div className="d-flex justify-content-between">
                            <Button type="submit" disabled={!stateContext.compilationResult}>
                                {(() => {
                                    if (state.isLoading) {
                                        return (
                                            <>
                                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                                <span className="ml-2">Computing...</span>
                                            </>
                                        );
                                    }
                                    return (
                                        <>
                                            <i className="fa fa-lightbulb-o" aria-hidden="true"></i>
                                            <span className="ml-2">Compute</span>
                                        </>
                                    )
                                })()}
                            </Button>
                            <ButtonGroup>
                                <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-remix-witness">Open in Remix Editor</Tooltip>}>
                                    <Button disabled={!state.result} variant="light" onClick={openInRemix}>
                                        <i className="fa fa-share" aria-hidden="true"></i>
                                    </Button>
                                </OverlayTrigger>
                                <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-download-witness">Download</Tooltip>}>
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