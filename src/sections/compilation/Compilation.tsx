import { HighlightPosition } from '@remixproject/plugin';
import copy from 'copy-to-clipboard';
import saveAs from 'file-saver';
import React, { useReducer } from 'react';
import { Button, ButtonGroup, Col, Form, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { compile } from 'zokrates-js';
import { hex } from '../../common/utils';
import { Alert, LoadingButton } from '../../components';
import { remixClient } from '../../remix/RemixClient';
import { remixResolver } from '../../remix/RemixResolver';
import { setCompileResult } from '../../state/actions';
import { useDispatchContext, useStateContext } from '../../state/Store';
import { onError, onLoading, onSuccess } from './actions';
import { compilationReducer, ICompilationState } from './reducer';

export const Compilation: React.FC = () => {

    const initialState = {
        isCompiling: false,
        result: null,
        error: ''
    } as ICompilationState;

    const stateContext = useStateContext();
    const dispatchContext = useDispatchContext();
    const [state, dispatch] = useReducer(compilationReducer, initialState)

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            dispatch(onLoading());

            let location = await remixClient.getCurrentFile();
            if (!location) {
                throw new Error('Location unknown');
            }

            let source = await remixClient.getFile(location);

            // we have to "preload" imports before compiling since remix plugin api returns promises
            await remixResolver.gatherImports(location, source);

            setTimeout((location) => {
                try {
                    let program = compile(source, location.split('/')[1]);
                    dispatch(onSuccess(program));
                    dispatchContext(setCompileResult(program, source));
                    remixClient.discardHighlight();
                } catch (error) {
                    highlightCompileError(error);
                    dispatch(onError(error));
                }
            }, 200, location);
        } catch (error) {
            dispatch(onError(error));
        }
    }

    const onCopy = () => {
        copy(hex(state.result));
    }

    const onDownload = () => {
        var blob = new Blob([state.result.buffer], { type: 'application/octet-stream' });
        saveAs(blob, "out");
    }

    const highlightCompileError = (error: string) => {
        var match = /\b(\d+):(\d+)\b/.exec(error);
        if (!match) {
            return;
        }
            
        var line = Number(match[1]) - 1;
        var column = Number(match[2]);
        
        var highlightPosition: HighlightPosition = {
            start: { line, column },
            end:   { line, column },
        }

        try {
            let file: string = error.split(':')[0];
            if (file) {
                remixClient.switchFile(file.endsWith('.code') ? file : file.concat('.code'));
                remixClient.highlight(highlightPosition, file, '#ff7675');
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <>
            <Row>
                <Col>
                    <Form onSubmit={onSubmit}>
                        <div className="d-flex justify-content-between">
                            <LoadingButton type="submit" disabled={!stateContext.isLoaded || state.isLoading}
                                defaultText="Compile" 
                                loadingText="Compiling..." 
                                iconClassName="fa fa-refresh" 
                                isLoading={state.isLoading} />
                            <ButtonGroup>
                                <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-copy-bytecode">Copy Bytecode</Tooltip>}>
                                    <Button disabled={!state.result} variant="light" onClick={onCopy}>
                                        <i className="fa fa-clipboard" aria-hidden="true"></i>
                                    </Button>
                                </OverlayTrigger>

                                <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-download-program">Download</Tooltip>}>
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
                Successfully compiled!
            </Alert>
            }
        </>
    );
}