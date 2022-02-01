import { HighlightPosition } from "@remixproject/plugin-api";
import React, { useReducer, useEffect } from "react";
import {
  Button,
  ButtonGroup,
  Col,
  Form,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { Alert, LoadingButton } from "../../components";
import { remixClient } from "../../remix/RemixClient";
import { remixResolver } from "../../remix/RemixResolver";
import { setCompilationResult } from "../../state/actions";
import { useDispatchContext, useStateContext } from "../../state/Store";
import { onError, onLoading, onSuccess } from "./actions";
import { compileReducer, ICompileState } from "./reducer";
import { WA_COMPILE, WA_ERROR } from "../../zokrates/constants";

export const Compile: React.FC = () => {
  const initialState = {
    isCompiling: false,
    result: null,
    error: "",
  } as ICompileState;

  const stateContext = useStateContext();
  const dispatchContext = useDispatchContext();
  const [state, dispatch] = useReducer(compileReducer, initialState);

  const { zokratesWebWorker } = stateContext;

  const onWorkerMessage = (e: MessageEvent) => {
    switch (e.data.type) {
      case WA_COMPILE: {
        let [artifacts, source] = e.data.payload;
        dispatch(onSuccess(artifacts));
        dispatchContext(setCompilationResult(artifacts, source));
        break;
      }
      case WA_ERROR: {
        if (e.data.payload.type !== WA_COMPILE) break;
        highlightCompileError(e.data.payload.error);
        dispatch(onError(e.data.payload.error));
        break;
      }
      default:
        break;
    }
  };

  useEffect(() => {
    let subscription = zokratesWebWorker.onMessage().subscribe(onWorkerMessage);
    return () => subscription.unsubscribe();
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      dispatch(onLoading());
      remixClient.discardHighlight();

      let location = await remixClient.getCurrentFile();
      if (!location) {
        throw new Error("Unknown location");
      }

      location = location.replace("browser/", "");
      let source = await remixClient.getFile(location);
      if (!source) {
        throw new Error("Invalid source");
      }

      // we have to "prefetch" imports to avoid promises
      await remixResolver.prefetchImports(location, source);

      setTimeout(
        (location) => {
          const payload = {
            source,
            location,
            imports: remixResolver.imports,
          };
          zokratesWebWorker.postMessage(WA_COMPILE, payload);
        },
        200,
        location
      );
    } catch (error) {
      dispatch(onError(error));
    }
  };

  const openInEditor = () => {
    remixClient.createFile("browser/abi.json", JSON.stringify(state.result.abi, null, 2));
  };

  const highlightCompileError = (error: string) => {
    const match = /\b(\d+):(\d+)\b/.exec(error);
    if (!match) {
      return;
    }

    const line = Number(match[1]) - 1;
    const column = Number(match[2]);

    const highlightPosition: HighlightPosition = {
      start: { line, column },
      end: { line, column },
    };

    try {
      const file: string = error.split(":")[0];
      if (file) {
        remixClient.switchFile(file);
        remixClient.highlight(highlightPosition, file, "#ff7675");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Row>
        <Col>
          <Form onSubmit={onSubmit}>
            <div className="d-flex justify-content-between">
              <LoadingButton
                type="submit"
                disabled={!stateContext.isLoaded || state.isLoading}
                defaultText="Compile"
                loadingText="Compiling..."
                iconClassName="fa fa-refresh"
                isLoading={state.isLoading}
              />
              <ButtonGroup>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id="tooltip-show-abi">Show ABI</Tooltip>}
                >
                  <Button
                    disabled={!state.result}
                    variant="light"
                    onClick={openInEditor}
                  >
                    <i className="fa fa-share" aria-hidden="true"></i>
                  </Button>
                </OverlayTrigger>
              </ButtonGroup>
            </div>
          </Form>
        </Col>
      </Row>
      {state.error && (
        <Alert variant="danger" iconClass="fa fa-exclamation-circle">
          <pre>
            <code>{state.error}</code>
          </pre>
        </Alert>
      )}
      {state.result && (
        <Alert variant="success" iconClass="fa fa-check">
          Successfully compiled!
        </Alert>
      )}
    </>
  );
};
