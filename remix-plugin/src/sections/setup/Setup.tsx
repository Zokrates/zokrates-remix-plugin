import React, { useReducer } from 'react';
import { Button, Col, Row, Spinner } from 'react-bootstrap';
import { setup } from '../../../../core';
import { Alert } from '../../common/alert';
import { setSetupResult } from '../../state/actions';
import { useDispatchContext, useStateContext } from '../../state/Store';
import { SetupResult } from '../../state/types';
import { onError, onSuccess, onLoading } from './actions';
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

    const onSetup = () => {
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
                    <Button onClick={onSetup} variant="primary" type="submit" disabled={!stateContext.compilationResult}>
                        {(() => {
                            if (state.isLoading) {
                                return (
                                    <>
                                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                        <span className="ml-2">Running setup...</span>
                                    </>
                                );
                            }
                            return (
                                <>
                                    <i className="fa fa-cog" aria-hidden="true"></i>
                                    <span className="ml-2">Run Setup</span>
                                </>
                            )
                        })()}
                    </Button>
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