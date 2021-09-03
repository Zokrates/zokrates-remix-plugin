import React, { useEffect, useReducer } from "react";
import {
  Col,
  Form,
  Row,
} from "react-bootstrap";
import { Alert, LoadingButton } from "../../components";
import { remixClient } from "../../remix/RemixClient";
import { useStateContext } from "../../state/Store";
import { onCleanup, onError, onLoading, onSuccess } from "./actions";
import { exportVerifierReducer, IExportVerifierState } from "./reducer";
import { WA_EXPORT_VERIFIER, WA_ERROR } from "../../zokrates/constants";

export const ExportVerifier: React.FC = () => {
  const initialState: IExportVerifierState = {
    isLoading: false,
    exported: false,
    error: "",
  };

  const stateContext = useStateContext();
  const [state, dispatch] = useReducer(exportVerifierReducer, initialState);

  const { zokratesWebWorker } = stateContext;

  const onWorkerMessage = (e: MessageEvent) => {
    switch (e.data.type) {
      case WA_EXPORT_VERIFIER: {
        const { verifier } = e.data.payload;
        dispatch(onSuccess());
        remixClient.createFile("browser/verifier.sol", verifier);
        break;
      }
      case WA_ERROR: {
        if (e.data.payload.type !== WA_EXPORT_VERIFIER) break;
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
  }, [stateContext.setupResult]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(onLoading());

    setTimeout(() => {
      try {
        zokratesWebWorker.postMessage(WA_EXPORT_VERIFIER, {
          vk: stateContext.setupResult.vk,
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
            Generates a Solidity contract which contains the generated
            verification key and a public function to verify a solution to the
            compiled program.
          </p>
          <Form onSubmit={onSubmit}>
            <div className="d-flex justify-content-between">
              <LoadingButton
                type="submit"
                disabled={!stateContext.setupResult || state.isLoading}
                defaultText="Export"
                loadingText="Exporting..."
                iconClassName="fa fa-key"
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
      {state.exported && (
        <Alert variant="success" iconClass="fa fa-check">
          Solidity verifier exported!
        </Alert>
      )}
    </>
  );
};
