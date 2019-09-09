import React, { useReducer } from 'react';
import { Button, Row, Col, ButtonGroup } from 'react-bootstrap';
import { remixClient } from '../../remix/remix-client'
import { remixResolver } from '../../remix/remix-resolver';
import { compile } from '../../../../core';
import { compilationReducer, ICompilationState } from './reducer';
import { useDispatchContext } from '../../state/Store';
import { showAlert } from '../../common/alert';

import copy from 'copy-to-clipboard';
import saveAs from 'file-saver';

export const Compilation: React.FC = () => {

    const initialState = {
        isCompiling: false,
        result: null,
        error: ''
    } as ICompilationState;

    const dispatchToContext = useDispatchContext();
    const [state, dispatch] = useReducer(compilationReducer, initialState)

    const compileCallback = async () => {
        try {
            dispatch({ type: 'compiling' });

            let location = await remixClient.getCurrentFile();
            let source = await remixClient.getFile(location);
    
            // we have to "preload" imports before compiling since remix plugin api returns promises
            await remixResolver.gatherImports(location, source);
            
            setTimeout(() => {
                try {
                    let program = compile(source);
                    dispatch({ 
                        type: 'success', 
                        payload: program 
                    });
        
                    dispatchToContext({ 
                        type: 'set_compile_result', 
                        payload: { 
                            program, source
                        }
                    });
                } catch (error) {
                    dispatchError(error);
                }
            }, 200);
        } catch (error) {
            dispatchError(error);
        }
    }

    const dispatchError = (error: string) => {
        console.log(error);
        dispatch({ 
            type: 'error', 
            payload: error.toString()
        });
    }

    const toBytecodeString = (input: Uint8Array): string => {
        return '0x' + Buffer.from(state.result).toString('hex');
    }

    const onCopy = () => {
        copy(toBytecodeString(state.result));
    }

    const onDownload = () => {
        var blob = new Blob([state.result.buffer], { type: 'application/octet-stream' });
        saveAs(blob, "out");
    }

    return (
        <>
            <Row>
                <Col>
                    <div className="d-flex justify-content-between">
                        <Button onClick={compileCallback}>
                            <i className="fa fa-refresh" aria-hidden="true"></i><span className="ml-2">{state.isCompiling ? 'Compiling...' : 'Compile'}</span>
                        </Button>
                        <ButtonGroup>
                            <Button disabled={!state.result} variant="light" onClick={onCopy} data-toggle="tooltip" data-placement="top" title="Copy Bytecode">
                                <i className="fa fa-clipboard" aria-hidden="true"></i>
                            </Button>
                            <Button disabled={!state.result} variant="light" onClick={onDownload} data-toggle="tooltip" data-placement="top" title="Download">
                                <i className="fa fa-download" aria-hidden="true"></i>
                            </Button>
                        </ButtonGroup>
                    </div>
                </Col>
            </Row>

            {state.error  && showAlert('danger', 'fa fa-exclamation-circle', state.error)}
            {state.result && showAlert('success', 'fa fa-check', 'Successfully compiled!')}
        </>
    );
}