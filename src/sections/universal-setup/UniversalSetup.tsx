import React, { useEffect, useReducer, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { Alert, LoadingButton } from "../../components";
import { setUniversalSetupResult } from "../../state/actions";
import { useDispatchContext, useStateContext } from "../../state/Store";
import { onError, onLoading, onSuccess } from "./actions";
import { IUniversalSetupState, universalSetupReducer } from "./reducer";
import { WA_ERROR, WA_UNIVERSAL_SETUP } from "../../zokrates/constants";

export const UniversalSetup: React.FC = () => {
  const initialState: IUniversalSetupState = {
    isLoading: false,
    result: null,
    error: "",
  };

  const stateContext = useStateContext();
  const dispatchContext = useDispatchContext();
  const [state, dispatch] = useReducer(universalSetupReducer, initialState);
  const { zokratesWebWorker } = stateContext;

  const [showWarning, setShowWarning] = useState(false);
  const [maxPolynomialDegree, setMaxPolynomialDegree] = useState(17);

  const onWorkerMessage = (e: MessageEvent) => {
    setShowWarning(false);
    switch (e.data.type) {
      case WA_UNIVERSAL_SETUP: {
        dispatch(onSuccess(e.data.payload));
        dispatchContext(setUniversalSetupResult(e.data.payload));
        break;
      }
      case WA_ERROR: {
        if (e.data.payload.type !== WA_UNIVERSAL_SETUP) break;
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

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(onLoading());

    setTimeout(() => {
      try {
        zokratesWebWorker.postMessage(WA_UNIVERSAL_SETUP, {
          size: maxPolynomialDegree,
          options: stateContext.options,
        });
        setTimeout(() => setShowWarning(true), 10000);
      } catch (error) {
        dispatch(onError(error.toString()));
      }
    }, 200);
  };

  return (
    <>
      <Row>
        <Col>
          <p>Performs the universal phase of a trusted setup.</p>
          <Form onSubmit={onSubmit}>
            <Form.Group>
              <Form.Label>
                Max polynomial degree (2^{maxPolynomialDegree})
              </Form.Label>
              <Form.Control
                type="range"
                min={1}
                max={21}
                value={maxPolynomialDegree}
                onChange={(e) =>
                  setMaxPolynomialDegree(parseInt(e.currentTarget.value))
                }
              />
            </Form.Group>
            <div className="d-flex justify-content-between">
              <LoadingButton
                type="submit"
                disabled={
                  stateContext.options.scheme !== "marlin" || state.isLoading
                }
                defaultText="Run Universal Setup"
                loadingText="Running universal setup..."
                iconClassName="fa fa-cog"
                isLoading={state.isLoading}
              />
            </div>
          </Form>
        </Col>
      </Row>
      {state.isLoading && showWarning && (
        <Alert variant="warning" iconClass="fa fa-exclamation-circle">
          This may take a while. Please wait...
        </Alert>
      )}
      {state.error && (
        <Alert variant="danger" iconClass="fa fa-exclamation-circle">
          {state.error}
        </Alert>
      )}
      {state.result && (
        <Alert variant="success" iconClass="fa fa-check">
          Universal setup completed!
        </Alert>
      )}
    </>
  );
};
