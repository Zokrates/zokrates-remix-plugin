import React, { useEffect, useReducer } from "react";
import {
  Col,
  Form,
  Row,
} from "react-bootstrap";
import { Alert, LoadingButton } from "../../components";
import { remixClient } from "../../remix/RemixClient";
import { setSetupResult } from "../../state/actions";
import { useDispatchContext, useStateContext } from "../../state/Store";
import { onCleanup, onError, onLoading, onSuccess } from "./actions";
import { ISetupState, setupReducer } from "./reducer";
import { WA_SETUP, WA_ERROR } from "../../zokrates/constants";

export const Setup: React.FC = () => {
  const initialState: ISetupState = {
    isLoading: false,
    result: null,
    error: "",
  };

  const stateContext = useStateContext();
  const dispatchContext = useDispatchContext();
  const [state, dispatch] = useReducer(setupReducer, initialState);
  const { zokratesWebWorker } = stateContext;

  const onWorkerMessage = (e: MessageEvent) => {
    switch (e.data.type) {
      case WA_SETUP: {
        dispatch(onSuccess(e.data.payload));
        dispatchContext(setSetupResult(e.data.payload));
        remixClient.createFile(
          "browser/verification_key.json",
          JSON.stringify(e.data.payload.vk, null, 2)
        );
        break;
      }
      case WA_ERROR: {
        if (e.data.payload.type !== WA_SETUP) break;
        dispatch(onError(e.data.payload.error));
        break;
      }
      default:
        break;
    }
  };

  useEffect(() => {
    const subscription = zokratesWebWorker
      .onMessage()
      .subscribe(onWorkerMessage);
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    dispatch(onCleanup());
    dispatchContext(setSetupResult(null));
  }, [stateContext.compilationResult]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(onLoading());

    setTimeout(() => {
      try {
        zokratesWebWorker.postMessage(WA_SETUP, {
          program: stateContext.compilationResult.artifacts.program,
        });
      } catch (error) {
        dispatch(onError(error.toString()));
      }
    }, 200);
  };

  return (
    <>
      <Row>
        <Col>
          <p>
            Creates a proving key and a verification key. These keys are derived
            from a source of randomness, commonly referred to as “toxic waste”.
          </p>
          <Form onSubmit={onSubmit}>
            <div className="d-flex justify-content-between">
              <LoadingButton
                type="submit"
                disabled={!stateContext.compilationResult || state.isLoading}
                defaultText="Run Setup"
                loadingText="Running setup..."
                iconClassName="fa fa-cog"
                isLoading={state.isLoading}
              />
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
          Setup completed!
        </Alert>
      )}
    </>
  );
};
