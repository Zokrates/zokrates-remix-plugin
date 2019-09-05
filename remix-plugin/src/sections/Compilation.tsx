import React from 'react';
import { Button, Row, Col, Alert } from 'react-bootstrap';
import { remixClient } from '../remix/remix-client'
import { remixResolver } from '../remix/remix-resolver';
import { useState } from 'react';
import { compile } from '../../../core';
import copy from 'copy-to-clipboard';
import saveAs from 'file-saver';

interface CompileState {
    compilationResult: Uint8Array,
    currentFile: string,
    error: string
}

export const Compilation: React.FC = () => {

    const [state, setState] = useState<Partial<CompileState>>({})

    const compileCallback = async () => {
        try {
            let location = await remixClient.getCurrentFile();
            let source = await remixClient.getFile(location);
    
            // we have to "preload" imports before compiling since remix plugin api returns promises
            await remixResolver.gatherImports(location, source);
            let program = compile(source);

            setState({ compilationResult: program, error: '' });
        } catch (error) {
            console.log(error);
            setState({ compilationResult: null, error: error.toString() })
        }
    }

    const toBytecodeString = (input: Uint8Array): string => {
        return '0x' + Buffer.from(state.compilationResult).toString('hex');
    }

    const onCopy = () => {
        copy(toBytecodeString(state.compilationResult));
    }

    const onDownload = () => {
        if (state.compilationResult) {
            var blob = new Blob([state.compilationResult.buffer], { type: 'application/octet-stream' });
            saveAs(blob, "out");
        }
    }

    return (
        <>
        <Row>
            <Col>
                <div className="d-flex justify-content-between">
                    <Button onClick={compileCallback}>
                        <i className="fa fa-refresh" aria-hidden="true"></i><span className="ml-2">Compile</span>
                    </Button>
                    <span id="actions">
                        <a className="btn btn-light pointer mr-1" data-toggle="tooltip" data-placement="top" title="Copy Bytecode"
                            onClick={onCopy}>
                            <i className="fa fa-clipboard" aria-hidden="true"></i>
                        </a>
                        <a className="btn btn-light pointer" data-toggle="tooltip" data-placement="top" title="Download"
                            onClick={onDownload}>
                            <i className="fa fa-download mr-1" aria-hidden="true"></i>
                        </a>
                    </span>
                </div>
            </Col>
        </Row>
        {(state.compilationResult || state.error) && 
        <Row>
            <Col>
                {state.error && <Alert variant="danger"><i className="fa fa-exclamation-circle mr-2" aria-hidden="true"></i>{state.error}</Alert>}
                {state.compilationResult && <Alert variant="success"><i className="fa fa-check mr-2" aria-hidden="true"></i>Successfully compiled!</Alert>}
            </Col>
        </Row>
        }
        </>
    );
}