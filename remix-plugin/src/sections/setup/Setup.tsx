import React, { useEffect, useReducer } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { setup } from '../../../../core';
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
                    <p>Creates a proving key and a verification key. These keys are derived from a source of randomness, commonly referred to as “toxic waste”.</p>
                    <Form onSubmit={onSubmit}>
                        <LoadingButton type="submit" disabled={!stateContext.compilationResult}
                            defaultText="Run Setup" 
                            loadingText="Running setup..." 
                            iconClassName="fa fa-cog" 
                            isLoading={state.isLoading} />
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