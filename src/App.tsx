import React, { useEffect } from "react";
import { Container, Spinner, Form, Accordion } from "react-bootstrap";
import "./App.css";
import { AccordionElement, Header } from "./components";
import { remixClient } from "./remix/RemixClient";
import { Compile } from "./sections/compile/Compile";
import { Compute } from "./sections/compute/Compute";
import { ExportVerifier } from "./sections/export-verifier/ExportVerifier";
import { GenerateProof } from "./sections/generate-proof/GenerateProof";
import { Setup } from "./sections/setup/Setup";
import { UniversalSetup } from "./sections/universal-setup/UniversalSetup";
import { onLoaded, setScheme } from "./state/actions";
import { useDispatchContext, useStateContext } from "./state/Store";
import { ZoKratesWebWorker } from "./zokrates/ZoKratesWebWorker";
import { metadata } from "zokrates-js";

const App: React.FC = () => {
  const state = useStateContext();
  const dispatch = useDispatchContext();

  useEffect(() => {
    const worker = new ZoKratesWebWorker();
    const load = async () => {
      try {
        await remixClient.onload();
        setTimeout(() => dispatch(onLoaded(worker)), 1000);
      } catch (err) {
        console.log(err);
      }
    };
    load();
    return () => worker.terminate();
  }, []);

  if (!state.isLoaded) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center h-100">
        <Spinner animation="grow" variant="primary" />
        <small className="mt-2">Initializing...</small>
      </div>
    );
  }

  return (
    <div id="wrapper">
      <Container>
        <Header />
        <Form.Group>
          <Form.Label>Select a proving scheme</Form.Label>
          <Form.Control
            as="select"
            onChange={(e) => dispatch(setScheme(e.currentTarget.value))}
          >
            <option value={"g16"}>Groth16</option>
            <option value={"gm17"}>GM17</option>
            <option value={"marlin"}>Marlin</option>
          </Form.Control>
        </Form.Group>
        <main role="main" className="pb-5">
          <Accordion>
            <AccordionElement
              headerText="Univeral Setup"
              iconClass="fa fa-globe"
              eventKey="0"
              disabled={state.options.scheme !== "marlin"}
            >
              <UniversalSetup />
            </AccordionElement>
            <AccordionElement
              headerText="Compile"
              iconClass="fa fa-refresh"
              eventKey="1"
            >
              <Compile />
            </AccordionElement>
            <AccordionElement
              headerText="Compute"
              iconClass="fa fa-lightbulb-o"
              eventKey="2"
              disabled={!state.compilationResult}
            >
              <Compute />
            </AccordionElement>
            <AccordionElement
              headerText="Setup"
              iconClass="fa fa-cog"
              eventKey="3"
              disabled={
                !state.compilationResult ||
                (state.options.scheme === "marlin" &&
                  !state.universalSetupResult)
              }
            >
              <Setup />
            </AccordionElement>
            <AccordionElement
              headerText="Generate Proof"
              iconClass="fa fa-check"
              eventKey="4"
              disabled={
                !state.compilationResult ||
                !state.computationResult ||
                !state.setupResult
              }
            >
              <GenerateProof />
            </AccordionElement>
            <AccordionElement
              headerText="Export Verifier"
              iconClass="fa fa-key"
              eventKey="5"
              disabled={!state.setupResult}
            >
              <ExportVerifier />
            </AccordionElement>
          </Accordion>
        </main>
      </Container>
      <footer className="footer">
        <div className="container">
          <div className="space-between">
            <span>
              <span className="mr-1">ZoKrates:</span>
              <a
                target="_blank"
                href={`https://github.com/Zokrates/ZoKrates/tree/${metadata.version}`}
              >
                {metadata.version}
              </a>
            </span>
            <a
              target="_blank"
              href="https://github.com/Zokrates/zokrates-remix-plugin/issues"
            >
              Report issues
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
