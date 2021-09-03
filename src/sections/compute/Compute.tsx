import React, { useEffect, useReducer } from "react";
import {
  Button,
  ButtonGroup,
  Col,
  Form,
  FormGroup,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { Abi } from "../../common/abiTypes";
import { Alert, LoadingButton } from "../../components";
import { remixClient } from "../../remix/RemixClient";
import { setComputationResult } from "../../state/actions";
import { useDispatchContext, useStateContext } from "../../state/Store";
import {
  onError,
  onFieldUpdate,
  onLoading,
  onReset,
  onSuccess,
} from "./actions";
import { InputComponent } from "./components/InputComponent";
import { computeReducer, IComputeState } from "./reducer";
import { WA_ERROR, WA_COMPUTE } from "../../zokrates/constants";

export const Compute: React.FC = () => {
  const initialState: IComputeState = {
    isLoading: false,
    result: null,
    error: "",
    inputFields: {},
  };

  const stateContext = useStateContext();
  const dispatchContext = useDispatchContext();
  const [state, dispatch] = useReducer(computeReducer, initialState);
  const { zokratesWebWorker } = stateContext;

  const abi: Abi = JSON.parse(stateContext.compilationResult.artifacts.abi);
  const inputs = abi.inputs;

  const onWorkerMessage = (e: MessageEvent) => {
    switch (e.data.type) {
      case WA_COMPUTE: {
        dispatch(onSuccess(e.data.payload));
        dispatchContext(setComputationResult(e.data.payload));
        break;
      }
      case WA_ERROR: {
        if (e.data.payload.type !== WA_COMPUTE) break;
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
    dispatch(onReset());
    dispatchContext(setComputationResult(null));
  }, [stateContext.compilationResult]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(onLoading());

    setTimeout(() => {
      try {
        const args = inputs.map(
          (component) => state.inputFields[component.name]
        );
        let computationParams = {
          artifacts: stateContext.compilationResult.artifacts,
          args,
        };
        zokratesWebWorker.postMessage(WA_COMPUTE, computationParams);
      } catch (error) {
        dispatch(onError(error));
      }
    }, 200);
  };

  const openInEditor = () => {
    remixClient.createFile("browser/witness", state.result.witness);
  };

  return (
    <>
      <Row>
        <Col>
          <p>
            Computes a witness for the compiled program. A witness is a valid
            assignment of the variables, which include the results of the
            computation.
          </p>
          <Form onSubmit={onSubmit}>
            {inputs.map((component, index) => {
              const inputValue = state.inputFields[component.name];
              return (
                <FormGroup key={`${component.name}~${index}`}>
                  <InputComponent
                    component={component}
                    value={inputValue}
                    onChange={(value) =>
                      dispatch(onFieldUpdate(component.name, value))
                    }
                  />
                </FormGroup>
              );
            })}
            <div className="d-flex justify-content-between">
              <LoadingButton
                type="submit"
                disabled={!stateContext.compilationResult || state.isLoading}
                defaultText="Compute"
                loadingText="Computing..."
                iconClassName="fa fa-lightbulb-o"
                isLoading={state.isLoading}
              />
              <ButtonGroup>
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id="tooltip-remix-witness">
                      Show Witness in Editor
                    </Tooltip>
                  }
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
          <pre style={{ whiteSpace: "normal" }}>
            <code>{state.error}</code>
          </pre>
        </Alert>
      )}
      {state.result && (
        <>
          <Alert variant="success" iconClass="fa fa-check">
            Computed successfully!
          </Alert>
          <pre className="bg-light p-2 mt-3 mb-0">
            <code>{state.result.output}</code>
          </pre>
        </>
      )}
    </>
  );
};
