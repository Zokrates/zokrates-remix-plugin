import React, { useReducer, useEffect } from 'react';
import { Row, Col, Button, InputGroup, FormControl, Form } from 'react-bootstrap';
import { computeWitness } from '../../../../core';
import { useStateContext, useDispatchContext } from '../../state/Store';
import { witnessReducer, IComputeWitnessState } from './reducer';
import { parseArguments } from './parser';
import { showAlert } from '../../common/alert';

export const ComputeWitness: React.FC = () => {

    const initialState: IComputeWitnessState = {
        isComputing: false,
        fields: {},
        result: null,
        error: ''
    }

    const stateContext = useStateContext();
    const dispatchToContext = useDispatchContext();
    const [state, dispatch] = useReducer(witnessReducer, initialState);

    useEffect(() => {
        dispatch({ 
            type: 'cleanup' 
        });
    }, [stateContext.compilationResult]);

    const compute = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            dispatch({ type: 'computing' });
            setTimeout(() => {
                let args: string[] = Object.values(state.fields);
                let witness = computeWitness(stateContext.compilationResult.program, args);
    
                dispatch({ 
                    type: 'success', 
                    payload: witness 
                })
                
                dispatchToContext({ 
                    type: 'set_witness_result', 
                    payload: witness 
                });
            }, 200);

        } catch (error) {
            console.log(error);
            dispatch({ 
                type: 'error',
                payload: error.toString() 
            })
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
                    <InputGroup.Text id={"inputText" + i}>{e}</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl placeholder="Value" type="number" required={true} value={state.fields[e] || ''} onChange={(event: any) => 
                    dispatch({
                        type: 'field',
                        field: e, 
                        payload: event.currentTarget.value, 
                    })} />
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
                            <i className="fa fa-lightbulb-o" aria-hidden="true"></i><span className="ml-2">{state.isComputing ? 'Computing...' : 'Compute Witness'}</span>
                        </Button>
                    </Form>
                </Col>
            </Row>
            {state.error  && showAlert('danger', 'fa fa-exclamation-circle', state.error)}
            {state.result && showAlert('success', 'fa fa-check', 'Witness computed!') }
        </>
    );
}