import { saveAs } from 'file-saver';
import React, { useEffect, useReducer } from 'react';
import { Button, ButtonGroup, Col, Form, FormControl, InputGroup, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { computeWitness } from 'zokrates-js';
import { Alert, LoadingButton } from '../../components';
import { remixClient } from '../../remix/RemixClient';
import { setWitnessResult } from '../../state/actions';
import { useDispatchContext, useStateContext } from '../../state/Store';
import { onCleanup, onError, onFieldChange, onLoading, onSuccess } from './actions';
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

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(onLoading());
        
        setTimeout(() => {
            try {
                let args: string[] = Object.values(state.fields).map(val => JSON.parse(val));
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
                    <OverlayTrigger key={e.name} placement="top" overlay={<Tooltip id={`tooltip-${e.name}`}>Private Field</Tooltip>}>
                        <InputGroup.Text><i className="fa fa-lock" aria-hidden="true"></i></InputGroup.Text>
                    </OverlayTrigger>}
                    <InputGroup.Text>{e.name + ": " + e.type}</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl type="text" placeholder="Field" name={`${e.name}`} value={state.fields[e.name] || ''} required={true} onChange={(event: any) =>
                    dispatch(onFieldChange(e.name, String(event.currentTarget.value)))} />
            </InputGroup>
        );
    }

    return (
        <>
            <Row>
                <Col>
                    <p>Computes a witness for the compiled program. A witness is a valid assignment of the variables, which include the results of the computation.</p>
                    <Form onSubmit={onSubmit}>
                        {renderInputFields()}
                        <div className="d-flex justify-content-between">
                            <LoadingButton type="submit" disabled={!stateContext.compilationResult || state.isLoading}
                                defaultText="Compute" 
                                loadingText="Computing..." 
                                iconClassName="fa fa-lightbulb-o" 
                                isLoading={state.isLoading} />
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