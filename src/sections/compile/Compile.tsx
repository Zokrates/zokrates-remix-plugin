import { HighlightPosition } from '@remixproject/plugin';
import JSZip from 'jszip';
import saveAs from 'file-saver';
import React, { useReducer, useRef, useState } from 'react';
import { Button, ButtonGroup, Col, Form, OverlayTrigger, Row, Tooltip, FormGroup } from 'react-bootstrap';
import { Alert, LoadingButton } from '../../components';
import { remixClient } from '../../remix/RemixClient';
import { remixResolver } from '../../remix/RemixResolver';
import { setCompilationResult } from '../../state/actions';
import { useDispatchContext, useStateContext } from '../../state/Store';
import { onError, onLoading, onSuccess } from './actions';
import { compileReducer, ICompileState } from './reducer';

export const Compile: React.FC = () => {

    const initialState = {
        isCompiling: false,
        result: null,
        error: ''
    } as ICompileState;

    const stateContext = useStateContext();
    const dispatchContext = useDispatchContext();
    const [state, dispatch] = useReducer(compileReducer, initialState);

    const [isReleaseMode, setReleaseMode] = useState(false);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            dispatch(onLoading());
            remixClient.discardHighlight();

            let location = await remixClient.getCurrentFile();
            if (!location) {
                throw new Error('Location unknown');
            }

            location = location.replace("browser/", "");
            let source = await remixClient.getFile(location);

            // we have to fetch imports before compiling to avoid promises
            await remixResolver.gatherImports(location, source);

            setTimeout((location) => {
                try {
                    const config = { is_release: isReleaseMode };
                    let artifacts = stateContext.zokratesProvider.compile(
                        source, 
                        location, 
                        remixResolver.syncResolve,
                        config
                    );
                    dispatch(onSuccess(artifacts));
                    dispatchContext(setCompilationResult(artifacts, source));
                } catch (error) {
                    highlightCompileError(error);
                    dispatch(onError(error));
                }
            }, 200, location);
        } catch (error) {
            dispatch(onError(error));
        }
    }

    const openInRemix = () => {
        remixClient.createFile('browser/abi.json', state.result.abi);
    }

    const onDownload = () => {
        let zip = new JSZip();
        zip.file("out", state.result.program);
        zip.file("abi.json", state.result.abi);
        zip.generateAsync({ type: "blob" }).then((content: any) => saveAs(content, "output.zip"));
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
                remixClient.switchFile(file);
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
                        <Form.Group controlId="releaseMode">
                            <Form.Check type="checkbox" label="Enable optimizations" name="optimzations" checked={isReleaseMode}
                                onChange={(e: any) => setReleaseMode(e.currentTarget.checked)} />
                        </Form.Group>
                        <div className="d-flex justify-content-between">
                            <LoadingButton type="submit" disabled={!stateContext.isLoaded || state.isLoading}
                                defaultText="Compile" 
                                loadingText="Compiling..." 
                                iconClassName="fa fa-refresh" 
                                isLoading={state.isLoading} />
                            <ButtonGroup>
                                <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-show-abi">Show ABI</Tooltip>}>
                                    <Button disabled={!state.result} variant="light" onClick={openInRemix}>
                                        <i className="fa fa-share" aria-hidden="true"></i>
                                    </Button>
                                </OverlayTrigger>

                                <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-download-program">Download Artifacts</Tooltip>}>
                                    <Button disabled={!state.result} variant="light" onClick={onDownload}>
                                    <i className="fa fa-download" aria-hidden="true"></i>
                                    </Button>
                                </OverlayTrigger>
                            </ButtonGroup>
                        </div>
                    </Form>
                </Col>
            </Row>
            {!state.isLoading && state.error && 
            <Alert variant='danger' iconClass='fa fa-exclamation-circle'>
                <pre>
                    <code>{state.error}</code>
                </pre>
            </Alert>
            }
            {!state.isLoading && state.result && 
            <Alert variant='success' iconClass='fa fa-check'>
                Successfully compiled!
            </Alert>
            }
        </>
    );
}