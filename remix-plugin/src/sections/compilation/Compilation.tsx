import copy from 'copy-to-clipboard';
import saveAs from 'file-saver';
import React, { useReducer } from 'react';
import { Button, ButtonGroup, Col, OverlayTrigger, Row, Spinner, Tooltip } from 'react-bootstrap';
import { compile } from '../../../../core';
import { Alert } from '../../common/alert';
import { remixClient } from '../../remix/remix-client';
import { remixResolver } from '../../remix/remix-resolver';
import { setCompileResult } from '../../state/actions';
import { useDispatchContext } from '../../state/Store';
import { onCompiling, onError, onSuccess } from './actions';
import { compilationReducer, ICompilationState } from './reducer';
import { HighlightPosition } from '@remixproject/plugin';

export const Compilation: React.FC = () => {

    const initialState = {
        isCompiling: false,
        result: null,
        error: ''
    } as ICompilationState;

    const dispatchContext = useDispatchContext();
    const [state, dispatch] = useReducer(compilationReducer, initialState)

    const compileCallback = async () => {
        try {
            dispatch(onCompiling());

            let location = await remixClient.getCurrentFile();
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
                    highlightCompileError(location, error);
                    dispatch(onError(error));
                }
            }, 200, location);
        } catch (error) {
            dispatch(onError(error));
        }
    }

    const toBytecodeString = (input: Uint8Array): string => {
        return '0x' + Buffer.from(input).toString('hex');
    }

    const onCopy = () => {
        copy(toBytecodeString(state.result));
    }

    const onDownload = () => {
        var blob = new Blob([state.result.buffer], { type: 'application/octet-stream' });
        saveAs(blob, "out");
    }

    const highlightCompileError = (location: string, error: string) => {
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

        remixClient.highlight(highlightPosition, location, '#ff7675');
    }

    return (
        <>
            <Row>
                <Col>
                    <div className="d-flex justify-content-between">
                        <Button onClick={compileCallback}>
                            {(() => {
                                if (state.isCompiling) {
                                    return (
                                        <>
                                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                            <span className="ml-2">Compiling...</span>
                                        </>
                                    );
                                }
                                return (
                                    <>
                                        <i className="fa fa-refresh" aria-hidden="true"></i>
                                        <span className="ml-2">Compile</span>
                                    </>
                                )
                            })()}
                        </Button>
                        <ButtonGroup>
                            <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-copy">Copy Bytecode</Tooltip>}>
                                <Button disabled={!state.result} variant="light" onClick={onCopy}>
                                    <i className="fa fa-clipboard" aria-hidden="true"></i>
                                </Button>
                            </OverlayTrigger>

                            <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-download">Download</Tooltip>}>
                                <Button disabled={!state.result} variant="light" onClick={onDownload}>
                                <i className="fa fa-download" aria-hidden="true"></i>
                                </Button>
                            </OverlayTrigger>
                        </ButtonGroup>
                    </div>
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