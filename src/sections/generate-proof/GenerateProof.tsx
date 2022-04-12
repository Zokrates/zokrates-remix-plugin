import copy from "copy-to-clipboard";
import React, { useEffect, useReducer } from "react";
import {
  Button,
  Col,
  Form,
  FormControl,
  FormLabel,
  InputGroup,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { Alert, LoadingButton } from "../../components";
import { remixClient } from "../../remix/RemixClient";
import { setGenerateProofResult } from "../../state/actions";
import { useDispatchContext, useStateContext } from "../../state/Store";
import { onCleanup, onError, onLoading, onSuccess } from "./actions";
import { generateProofReducer, IGenerateProofState } from "./reducer";
import { WA_GENERATE_PROOF, WA_ERROR } from "../../zokrates/constants";
import { Proof } from "zokrates-js";

export const GenerateProof: React.FC = () => {
  const initialState: IGenerateProofState = {
    isLoading: false,
    result: null,
    error: "",
  };

  const stateContext = useStateContext();
  const dispatchContext = useDispatchContext();
  const [state, dispatch] = useReducer(generateProofReducer, initialState);
  const { zokratesWebWorker } = stateContext;

  const onWorkerMessage = (e: MessageEvent) => {
    switch (e.data.type) {
      case WA_GENERATE_PROOF: {
        dispatch(onSuccess(e.data.payload));
        dispatchContext(setGenerateProofResult(e.data.payload));
        remixClient.createFile(
          "browser/proof.json",
          JSON.stringify(e.data.payload, null, 2)
        );
        break;
      }
      case WA_ERROR: {
        if (e.data.payload.type !== WA_GENERATE_PROOF) break;
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
    dispatchContext(setGenerateProofResult(null));
  }, [
    stateContext.compilationResult,
    stateContext.computationResult,
    stateContext.setupResult,
  ]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(onLoading());

    setTimeout(() => {
      try {
        zokratesWebWorker.postMessage(WA_GENERATE_PROOF, {
          program: stateContext.compilationResult.artifacts.program,
          witness: stateContext.computationResult.witness,
          pk: stateContext.setupResult.pk,
        });
      } catch (error) {
        dispatch(onError(error.toString()));
      }
    }, 200);
  };

  const getCompatibleParametersFormat = (proof: Proof) => {
    const proofValues = Object.values(proof.proof)
      .map((el) => JSON.stringify(el))
      .join();
    
    let fmt = `[${proofValues}]`;
    if (proof.inputs && proof.inputs.length > 0) {
        fmt += `,${JSON.stringify(proof.inputs)}`;
    }
    return fmt;
  };

  return (
    <>
      <Row>
        <Col>
          <p>
            Generates a proof for a computation of the compiled program using
            proving key and computed witness.
          </p>
          <Form onSubmit={onSubmit}>
            <div className="d-flex justify-content-between">
              <LoadingButton
                type="submit"
                className="btn-overflow"
                disabled={
                  !stateContext.compilationResult ||
                  !stateContext.computationResult ||
                  !stateContext.setupResult ||
                  state.isLoading
                }
                defaultText="Generate"
                loadingText="Generating..."
                iconClassName="fa fa-check"
                isLoading={state.isLoading}
              />
            </div>
          </Form>
        </Col>
      </Row>
      {state.result &&
        (() => {
          const result = getCompatibleParametersFormat(
            state.result
          );
          return (
            <Row>
              <Col>
                <FormLabel>Verifier inputs:</FormLabel>
                <InputGroup>
                  <FormControl
                    aria-label="Parameters"
                    value={result}
                    readOnly
                  />
                  <InputGroup.Append>
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id="tooltip-copy-verifier-inputs">
                          Copy
                        </Tooltip>
                      }
                    >
                      <Button
                        disabled={!state.result}
                        onClick={() => copy(result)}
                      >
                        <i className="fa fa-clipboard" aria-hidden="true"></i>
                      </Button>
                    </OverlayTrigger>
                  </InputGroup.Append>
                </InputGroup>
              </Col>
            </Row>
          );
        })()}
      {state.error && (
        <Alert variant="danger" iconClass="fa fa-exclamation-circle">
          <pre>
            <code>{state.error}</code>
          </pre>
        </Alert>
      )}
      {state.result && (
        <Alert variant="success" iconClass="fa fa-check">
          Proof generated!
        </Alert>
      )}
    </>
  );
};
