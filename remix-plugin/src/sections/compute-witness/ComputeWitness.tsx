import React, { useEffect, useReducer } from 'react';
import { Button, Col, Form, FormControl, InputGroup, OverlayTrigger, Row, Spinner, Tooltip } from 'react-bootstrap';
import { computeWitness } from '../../../../core';
import { showAlert } from '../../common/alert';
import { setWitnessResult } from '../../state/actions';
import { useDispatchContext, useStateContext } from '../../state/Store';
import { onCleanup, onComputing, onError, onFieldChange, onSuccess } from './actions';
import { parseArguments } from './parser';
import { IComputeWitnessState, witnessReducer } from './reducer';

export const ComputeWitness: React.FC = () => {

    const initialState: IComputeWitnessState = {
        isComputing: false,
        fields: {},
        result: null,
        error: ''
    }

    const stateContext = useStateContext();
    const dispatchContext = useDispatchContext();
    const [state, dispatch] = useReducer(witnessReducer, initialState);

    useEffect(() => {
        dispatch(onCleanup());
    }, [stateContext.compilationResult]);

    const compute = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            dispatch(onComputing());
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
        } catch (error) {
            dispatch(onError(error));
        }
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
                <FormControl placeholder="Value" type="number" name={`${e.field}`} required={true} value={state.fields[e.field] || ''} onChange={(event: any) =>
                    dispatch(onFieldChange(e.field, event.currentTarget.value))} />
            </InputGroup>
        );
    }

    return (
        <>
            <Row>
                <Col>
                    <Form onSubmit={compute}>
                        {renderInputFields()}
                        <Button type="submit" disabled={!stateContext.compilationResult}>
                            {(() => {
                                if (state.isComputing) {
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
                    </Form>
                </Col>
            </Row>
            {state.error && showAlert('danger', 'fa fa-exclamation-circle', state.error)}
            {state.result && showAlert('success', 'fa fa-check', 'Witness computed!')}
        </>
    );
}