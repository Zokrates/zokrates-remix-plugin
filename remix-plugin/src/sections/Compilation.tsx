import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { remixClient } from '../remix/remix-client'
import { remixResolver } from '../remix/remix-resolver';
import { useState } from 'react';
import { compile } from '../../../core';
import { storageManager } from '../utils/LocalStorageManager';
import copy from 'copy-to-clipboard';
import saveAs from 'file-saver';

interface CompileState {
    compiled: string,
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

            let compiled = compile(source);
            storageManager.setItem(location, compiled);

            setState({ compiled, error: '' });
        } catch (error) {
            setState({ compiled: '', error: error.toString() })
        }
    }

    const onCopy = () => copy(state.compiled);

    const onDownload = () => {
        if (state.compiled) {
            var blob = new Blob([state.compiled], { type: "text/plain;charset=utf-8" });
            saveAs(blob, "out.code");
        }
    }

    return (
        <>
        <Row>
            <Col>
                <div className="d-flex justify-content-between align-items-center">
                    <Button onClick={compileCallback}>
                        <i className="fa fa-refresh" aria-hidden="true"></i><span className="ml-2">Compile</span>
                    </Button>
                    <span id="actions">
                        <a className="btn btn-light pointer mr-1" data-toggle="tooltip" data-placement="top" title="Copy"
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
        <Row>
            <Col>
                <textarea className="form-control w-100" rows={8} value={state.compiled} placeholder="Output" readOnly />
            </Col>
        </Row>
        <Row>
            <Col>
                {state.error && 
                <div className="error">
                    <i className="fa fa-exclamation-circle mr-2" aria-hidden="true"></i>{state.error}
                </div>}
            </Col>
        </Row>
        </>
    );
}